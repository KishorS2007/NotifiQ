# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy maven executable to the image
COPY mvnw .
COPY .mvn .mvn

# Make it executable
RUN chmod +x ./mvnw

# Copy the pom.xml file
COPY pom.xml .

# Download all required dependencies into one layer
RUN ./mvnw dependency:go-offline -B

# Copy your other files
COPY src src

# Build project
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
