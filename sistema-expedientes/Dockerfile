# Usar una imagen base de OpenJDK 21
FROM openjdk:21-jdk-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo JAR a la imagen
COPY target/sistema-expedientes-0.0.1-SNAPSHOT.jar /app/expedientes.jar

# Exponer el puerto en el que corre la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "expedientes.jar"]