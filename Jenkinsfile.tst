node {
    def app

    stage('Clone repository') {
        checkout scm
    }

    stage('Deploy') {
        sh 'docker --context ext-c04 compose -f docker-compose.yaml up -d --build'
    }

    stage('Cleanup') {
        step([$class: 'WsCleanup'])
    }
}
