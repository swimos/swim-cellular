FROM oracle/graalvm-ce:latest
LABEL maintainer=rohitbose
WORKDIR /app
COPY libs libs/
ENTRYPOINT ["java", "-Xms12g", "-Xmx12g", "-cp", "/app/libs/*", "swim.cellular.CellularPlane"]
EXPOSE 80 443 9001
