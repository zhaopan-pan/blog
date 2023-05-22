/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    tools {
        nodejs 'NodeJS_16.20.0'
    }
    stages {
        stage('pull') {
            steps {
                git branch: 'master',
                credentialsId: '7130d54c-1d2f-4510-bc2d-3f1cf4a33fbc',
                url: 'git@github.com:zhaopan-pan/blog.git'
            }
        }
        stage('build') {
            steps {
                sh 'ls -a'
                sh 'corepack enable'
                sh 'corepack prepare pnpm@latest-8 --activate'
                sh 'pnpm install'
                timeout(time: 15, unit: 'MINUTES') {
                    sh 'npm run build'
                }
            }
        }
        stage('move') {
            steps {
                sh 'sudo mv ./dist/* /home/webroot/blog/'
            }
        }
    }
}
