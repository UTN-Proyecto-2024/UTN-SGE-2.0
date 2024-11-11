node {
    withCredentials([
        string(credentialsId: 'next-auth-secret', variable: 'NEXTAUTH_SECRET'),
        string(credentialsId: 'smtp-mail-emisor', variable: 'SMTP_MAIL_EMISOR'),
        usernamePassword(credentialsId: 'database', usernameVariable: 'PGUSER', passwordVariable: 'PGPASSWORD'),
        usernamePassword(credentialsId: 'discord', usernameVariable: 'DISCORD_CLIENT_ID', passwordVariable: 'DISCORD_CLIENT_SECRET'),
        usernamePassword(credentialsId: 'keycloak', usernameVariable: 'KEYCLOAK_CLIENT_ID', passwordVariable: 'KEYCLOAK_CLIENT_SECRET')
    ]) {
        env.PGDATABASE = 'sge2'
        env.NEXTAUTH_URL = 'https://sge-tst.frba.utn.edu.ar'
        env.RUTA_ACTUAL = 'https://sge-tst.frba.utn.edu.ar'
        env.KEYCLOAK_ISSUER = 'https://auth-tst.frba.utn.edu.ar/realms/externo'
        env.SMTP_HOST = 'smtp.gmail.com'
        env.SMTP_PORT = '587'
        env.SMTP_SECURE = 'false'
        env.DATABASE_URL = "postgres://${env.PGUSER}:${env.PGPASSWORD}@db:5432/${env.PGDATABASE}"

        def app

        stage('Clone repository') {
            checkout scm
        }

        stage('Build image') {
            app = docker.build('ext/sge2', '--pull .')
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
}
