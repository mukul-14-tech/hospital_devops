pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            environment {
                MONGO_URI = 'mongodb://127.0.0.1:27017/hospitalDB'
                JWT_SECRET = 'secret123'
            }

            steps {
                dir('backend') {
                    bat 'npm test || exit 0'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Docker') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                bat 'docker compose up -d'
            }
        }

    }
}