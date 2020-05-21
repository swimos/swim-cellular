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

### Running a local cluster

Run two Swim instances on your local machine to distribute the application's
Web Agents between two processes.

```sh
# Start the first fabric node in one terminal window
$ ./gradlew run -Dswim.config.resource=server-a.recon

# Start the second fabric node in another terminal window
$ ./gradlew run -Dswim.config.resource=server-b.recon
```

When both processes are up and running, you can point your browser at either
http://localhost:9008 (Server A) or http://localhost:9009 (Server B).  You
will see a live view of all Web Agents, regardless of which server you point
your browser at.  Swim transparently demultiplexes links opened by external
clients, and routes them to the appropriate server in the fabric.

### Introspecting a running application

The Swim runtime exposes its internal subsystems as a set of meta web agents.

#### Host Introspection

Use the `swim:meta:host` agent to introspect a running host.  Use the `pulse`
lane to stream high level stats:

```sh
swim-cl i sync -h warps://cellular.swim.services -n swim:meta:host -l pulse
```

The `nodes` lane enumerates all agents running on a host:

```sh
swim-cli sync -h warps://cellular.swim.services -n swim:meta:host -l nodes
```

The fragment part of the `nodes` lane URI can contain a URI subpath filter:

```sh
swim-cli sync -h warps://cellular.swim.services -n swim:meta:host -l nodes#/
```

#### Node Introspection

You can stream the utilization of an individual web agent:

```sh
swim-cli sync -h warps://cellular.swim.services -n swim:meta:node/%2fcountry%2fUS -l pulse
```

And discover its lanes:

```sh
swim-cli sync -h warps://cellular.swim.services -n swim:meta:node/%2fcountry%2fUS -l lanes
```

Some additional examples:

```sh
swim-cli sync -h warps://cellular.swim.services -n swim:meta:node/%2fcountry%2fUS%2fstate%2fCA -l pulse
swim-cli sync -h warps://cellular.swim.services -n swim:meta:node/%2fcountry%2fUS%2fstate%2fCA -l lanes
swim-cli sync -h warps://cellular.swim.services -n swim:meta:node/%2fsite%2f1440 -l pulse
swim-cli sync -h warps://cellular.swim.services -n swim:meta:node/%2fsite%2f1440 -l lanes
```

#### Mesh introspection

```sh
swim-cli sync -h warps://cellular.swim.services -n swim:meta:edge -l meshes
```

#### Log introspection

You can stream log message for a particular web agent:

```sh
swim-cli sync -h warps://cellular.swim.services -n swim:meta:node/%2fsite%2f1440 -l debugLog
```

Or stream all log messages for a host:

```sh
swim-cli sync -h warps://cellular.swim.services -n swim:meta:host -l debugLog
```

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
