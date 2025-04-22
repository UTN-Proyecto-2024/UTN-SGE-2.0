node {
    def app

    stage('Clone repository') {
        checkout scm
    }

    stage('Build image') {
        app = docker.build('ext/sge2', '--pull -f docker/Dockerfile .')
    }

    stage('Push image') {
        docker.withRegistry('https://registry.frba.utn.edu.ar', 'registry-gitlab') {
            app.push('latest')
        }
    }

    stage('Update images in ext-c04') {
        sh 'ls -la /var/lib/jenkins/workspace/EXT - Electronica - SGE NEW - TST'
        sh 'docker --context ext-c04 compose -f docker/docker-compose.yaml pull'
    }

    stage('Deploy') {
        sh 'docker --context ext-c04 compose -f docker/docker-compose.yaml up -d'
    }

    stage('Cleanup') {
        step([$class: 'WsCleanup'])
    }
}
