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
                MONGO_URI = 'mongodb://172.18.0.2:27017/hospitalDB'
                JWT_SECRET = 'secret123'
            }
            steps {
                dir('backend') {
                    sh 'npm test || true'
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

        stage('Build Docker') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }

    }
}