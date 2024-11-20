node {
    def app

    stage('Clone repository') {
        checkout scm
    }

    stage('Build image') {
        sh 'docker --context ext-c04 compose -f docker-compose.yaml build'
    }

    stage('Push image') {
        docker.withRegistry('https://registry.frba.utn.edu.ar', 'registry-gitlab') {
            app.push('latest')
        }
    }

    stage('Update images in ext-c04') {
        sh 'docker --context ext-c04 compose -f docker-compose.yaml pull'
    }

    stage('Deploy') {
        sh 'docker --context ext-c04 compose -f docker-compose.yaml up -d'
    }

    stage('Cleanup') {
        step([$class: 'WsCleanup'])
    }
}
