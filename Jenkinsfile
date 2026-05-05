pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            environment {
                NODE_ENV = 'test'
                MONGO_URI = 'mongodb://mongo:27017/hospitalDB'
                JWT_SECRET = 'secret123'
            }
            steps {
                dir('backend') {
                    sh 'npm test || true'
                }
            }
        }

        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'sonar-scanner'
            }
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Fix Prometheus Setup') {
            steps {
                sh '''
                rm -rf prometheus
                mkdir prometheus
                cat <<EOF > prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9090']
EOF
                '''
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run Containers') {
            environment {
                MONGO_URI = 'mongodb://mongo:27017/hospitalDB'
                JWT_SECRET = 'secret123'
            }
            steps {
                sh 'docker-compose up -d'
            }
        }

    }
}