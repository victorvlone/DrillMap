
FROM openjdk:21-jdk-slim as build


WORKDIR /app


COPY backend/pom.xml /app/pom.xml
RUN mvn clean dependency:resolve


COPY backend/src /app/src


RUN mvn clean package -DskipTests


FROM openjdk:21-jre-slim

WORKDIR /app


COPY --from=build /app/target/*.jar /app/app.jar

CMD ["java", "-jar", "/app/app.jar"]
