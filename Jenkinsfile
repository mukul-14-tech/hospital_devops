pipeline {
    agent any

    environment {
        // Project environment variables
        COMPOSE_PROJECT_NAME = 'hospital_devops'
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Automatically pulls the latest code based on Webhook triggers
                checkout scm
                echo 'Source code checked out successfully.'
            }
        }

        stage('Install & Test Backend') {
            steps {
                // Navigate into backend, install dependencies and run unit tests
                dir('backend') {
                    echo 'Installing backend dependencies...'
                    sh 'npm install'
                    
                    echo 'Running automated test suites...'
                    sh 'npm run test'
                }
            }
        }

        stage('Build Containers') {
            steps {
                echo 'Building optimized multi-stage Docker images...'
                // Using docker-compose to build the frontend and backend containers
                sh 'docker-compose build'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploying application stack...'
                // Spin up the application in detached mode
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo '✅ Deployment successful! The Hospital Management System is fully operational.'
        }
        failure {
            echo '❌ Pipeline failed during execution. Please review the logs.'
            // Optional: Send slack notification or email here
        }
    }
}
