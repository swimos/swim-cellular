# Swim Cellular Network Simulator

A tutorial application for teaching core Swim concepts.  See a hosted version
of this app running at [https://cellular.swim.services](https://cellular.swim.services).

## Getting Started

### Prerequisites

#### [Install JDK 11+](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

- Ensure that your `JAVA_HOME` environment variable points to the Java installation.
- Ensure that your `PATH` includes `$JAVA_HOME`.

### Running on Windows

```bat
$ gradlew.bat run
```

### Running on Linux or MacOS

```bash
$ ./gradlew run
```

### Viewing the UI

Open a web browser to [http://localhost:9001](http://localhost:9001).

## Repository Structure

### Key files

- [gradlew](gradlew)/[gradlew.bat](gradlew.bat) — backend build script
- [build.gradle](build.gradle) — backend project configuration script
- [gradle.properties](gradle.properties) — backend project configuration variables
- [package.json](package.json) — frontend project configuration
- [rollup.config.js](rollup.config.js) — frontend bundle configuration script

### Key directories

- [src](src) — backend and frontend source code, and configuration resources
  - [main/java](src/main/java) — backend source code
  - [main/resources](src/main/resources) — backend configuration resources
  - [main/typescript](src/main/typescript) — frontend source code
- [pkg](pkg) — support files for generated OS packages
- [docker](docker) — support files for generating Docker images
- [gradle](gradle) — support files for the `gradlew` build script
