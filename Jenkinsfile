pipeline{
    agent any
    tools {
        nodejs 'NodeJS_16.20.0'
    }
    stages{
        stage("pull"){
            steps {
                sh 'sudo rm -rf public'
                sh 'sudo rm -rf logs'
                git branch: 'master', credentialsId: '7130d54c-1d2f-4510-bc2d-3f1cf4a33fbc', url: 'git@github.com:zhaopan-pan/blog.git'
            }
        }
        stage("project build"){
            steps {
                sh 'npm install pnpm - g'
                sh 'pnpm install'
                sh 'npm run build'
                sh 'sudo rm -rf node_modules'
                sh 'sudo mv dist /home/webroot/blog'
            }
        }
        stage("project move"){
            steps {
                sh 'sudo mv ./dist/* /home/webroot/blog/'
            }
        }
    }
}
