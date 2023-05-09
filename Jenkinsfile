pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            inheritFrom 'default'
            yaml '''
        apiVersion: v1
        kind: Pod
        metadata:
          labels:
            some-label: some-label-value
        spec:
          containers:
          - name: java
            image: openjdk:11
            command:
            - cat
            tty: true
          - name: kubectl
            image: rancher/kubectl:v1.27.1
            command:
            - cat
            tty: true
        '''
        }
    }

    environment {
        PROD = "${env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'master'}"
        APPLICATION_VERSION="1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('build') {
            steps {
                container('java') {
                    sh "./gradlew clean build --no-daemon"
                }
            }
        }
        stage('release') {
            steps {
//                if(env.PROD == "true") {
                container('java') {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'REGISTRY_PASSWORD', usernameVariable: 'REGISTRY_USERNAME')]) {
                        sh "./gradlew clean jib --no-daemon -Papplication.version=${APPLICATION_VERSION}"
                    }
//                }
                }
            }
        }
        stage('deploy') {
            steps {
                sh "sed 's/DOCKER_IMAGE/nstream\\/demo-cellular:${APPLICATION_VERSION} > k8s.apply.yml"
                archiveArtifacts artifacts: 'k8s.apply.yml', followSymlinks: false
                sh "kubectl apply -f k8s.apply.yml"
            }
        }
    }
}