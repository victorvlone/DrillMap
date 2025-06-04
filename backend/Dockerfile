
FROM openjdk:21-slim as build

WORKDIR /app

COPY backend/pom.xml /app/
COPY backend/src /app/src


RUN apt-get update && apt-get install -y maven \
    && mvn clean package -DskipTests

FROM openjdk:21-slim

WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

CMD ["java", "-jar", "/app/app.jar"]
