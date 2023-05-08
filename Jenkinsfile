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
        '''
        }
    }

    environment {
        PROD = (env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'master')
    }

    stages {
        stage('build') {
            steps {
                container('java') {
                    sh "./gradlew build"
                }
            }
        }
        stage('release') {
            steps {
                if(PROD) {
                    sh "./gradlew jib:build"
                }
            }
        }
    }
}