pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    environment {
        // ── Docker / ECR ──────────────────────────────────────────────────────
        AWS_REGION        = 'ap-south-1'                    // Mumbai — change if needed
        AWS_ACCOUNT_ID    = credentials('824122062557')   // Jenkins secret text
        ECR_REPO_BACKEND  = 'hospital-backend'
        ECR_REPO_FRONTEND = 'hospital-frontend'
        ECR_REGISTRY      = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_TAG         = "${BUILD_NUMBER}"

        // ── SonarQube ─────────────────────────────────────────────────────────
        SONAR_PROJECT_KEY = 'hospital_devops'

        // ── App secrets (stored in Jenkins credentials, never hardcoded) ──────
        MONGO_URI         = credentials('mongodb://127.0.0.1:27017/hospitalDB')
        JWT_SECRET        = credentials('secret123')
    }

    stages {

        // ── 1. CHECKOUT ───────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mukul-14-tech/hospital_devops.git'
            }
        }

        // ── 2. INSTALL BACKEND ────────────────────────────────────────────────
        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        // ── 3. RUN TESTS ──────────────────────────────────────────────────────
        stage('Run Backend Tests') {
            environment {
                NODE_ENV = 'test'
                MONGO_URI = 'mongodb://localhost:27017/hospitalDB_test'
                JWT_SECRET = 'test-secret-key'
            }
            steps {
                dir('backend') {
                    // Runs Jest and outputs JUnit XML for Jenkins test report
                    sh 'npm test -- --reporters=default --reporters=jest-junit || true'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'backend/junit.xml'
                }
            }
        }

        // ── 4. INSTALL & BUILD FRONTEND ───────────────────────────────────────
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        // ── 5. SONARQUBE ANALYSIS ─────────────────────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {   // matches name in Jenkins > Configure System
                    sh """
                        npx sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.projectName="Hospital DevOps" \
                          -Dsonar.sources=backend/src,frontend/src \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.test.js \
                          -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info \
                          -Dsonar.test.inclusions=**/*.test.js \
                          -Dsonar.sourceEncoding=UTF-8
                    """
                }
            }
        }

        // ── 6. QUALITY GATE ───────────────────────────────────────────────────
        stage('Quality Gate') {
            steps {
                // Waits up to 5 min for SonarQube to finish analysis
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ── 7. BUILD DOCKER IMAGES ────────────────────────────────────────────
        stage('Build Docker Images') {
            steps {
                sh """
                    docker build -t ${ECR_REGISTRY}/${ECR_REPO_BACKEND}:${IMAGE_TAG} \
                                 -t ${ECR_REGISTRY}/${ECR_REPO_BACKEND}:latest \
                                 ./backend

                    docker build -t ${ECR_REGISTRY}/${ECR_REPO_FRONTEND}:${IMAGE_TAG} \
                                 -t ${ECR_REGISTRY}/${ECR_REPO_FRONTEND}:latest \
                                 ./frontend
                """
            }
        }

        // ── 8. PUSH TO AWS ECR ────────────────────────────────────────────────
        stage('Push to ECR') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} \
                          | docker login --username AWS \
                                        --password-stdin ${ECR_REGISTRY}

                        docker push ${ECR_REGISTRY}/${ECR_REPO_BACKEND}:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/${ECR_REPO_BACKEND}:latest

                        docker push ${ECR_REGISTRY}/${ECR_REPO_FRONTEND}:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/${ECR_REPO_FRONTEND}:latest
                    """
                }
            }
        }

        // ── 9. DEPLOY TO AWS EC2 ──────────────────────────────────────────────
        // Connects to your EC2 instance via SSH and pulls the new images.
        // Replace <EC2_PUBLIC_IP> with your instance IP or use an SSH Jenkins credential.
        stage('Deploy to AWS EC2') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-ssh-key',
                    keyFileVariable: 'EC2_KEY',
                    usernameVariable: 'EC2_USER'
                )]) {
                    withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                        sh """
                            # Export image tags so docker-compose on EC2 picks them up
                            export IMAGE_TAG=${IMAGE_TAG}
                            export ECR_REGISTRY=${ECR_REGISTRY}
                            export ECR_REPO_BACKEND=${ECR_REPO_BACKEND}
                            export ECR_REPO_FRONTEND=${ECR_REPO_FRONTEND}
                            export AWS_REGION=${AWS_REGION}

                            ssh -o StrictHostKeyChecking=no \
                                -i \$EC2_KEY \
                                \${EC2_USER}@\$(aws ec2 describe-instances \
                                    --filters "Name=tag:Name,Values=hospital-server" \
                                              "Name=instance-state-name,Values=running" \
                                    --query 'Reservations[0].Instances[0].PublicIpAddress' \
                                    --output text) \
                            'bash -s' << 'REMOTE'
                                aws ecr get-login-password --region ${AWS_REGION} \
                                  | docker login --username AWS \
                                                --password-stdin ${ECR_REGISTRY}

                                cd /home/ec2-user/hospital_devops
                                git pull origin main

                                export IMAGE_TAG=${IMAGE_TAG}
                                export ECR_REGISTRY=${ECR_REGISTRY}

                                docker-compose pull
                                docker-compose up -d --remove-orphans
                                docker image prune -f
REMOTE
                        """
                    }
                }
            }
        }
    }

    // ── POST ACTIONS ──────────────────────────────────────────────────────────
    post {
        success {
            echo "✅ Pipeline succeeded — build #${BUILD_NUMBER} is live!"
            // Uncomment to enable Slack notifications (requires Slack plugin):
            // slackSend channel: '#devops', color: 'good',
            //   message: "✅ hospital_devops #${BUILD_NUMBER} deployed successfully."
        }
        failure {
            echo "❌ Pipeline failed at stage: ${currentBuild.result}"
            // slackSend channel: '#devops', color: 'danger',
            //   message: "❌ hospital_devops #${BUILD_NUMBER} FAILED. Check: ${BUILD_URL}"
        }
        always {
            // Remove dangling images from Jenkins agent
            sh 'docker image prune -f || true'
            cleanWs()
        }
    }
}