FROM openjdk:21-jdk-slim
ARG JAVA_JAR=target/signoaventura-0.0.1-SNAPSHOT.jar
COPY ${JAVA_JAR} app_signoaventura.jar
ENTRYPOINT ["java", "-jar", "app_signoaventura.jar"]
