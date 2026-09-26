# Project 2 — Container Security Hardening

## Overview

This project takes the static Nginx web application from Project 1 and hardens its Docker runtime without changing the application itself.

The goal was to identify and reduce unnecessary container privileges, restrict filesystem write access, pin the base image, remediate an OS-level vulnerability, and validate that the application continued to function after hardening.

The project follows a baseline → hardening → validation approach, with security evidence captured before and after the changes.

## Objectives

* Establish the security baseline of the Project 1 container.
* Run the application as a non-root user.
* Remove unnecessary Linux capabilities.
* Prevent privilege escalation with `no-new-privileges`.
* Make the container root filesystem read-only.
* Provide a tightly restricted writable `/tmp` filesystem.
* Pin the Nginx base image by digest.
* Scan the final image for vulnerabilities and secrets.
* Remediate identified OS-level vulnerabilities.
* Deploy the hardened configuration reproducibly with Docker Compose.
* Validate that the application remains functional after hardening.

## Application

The application is a static web application served by Nginx.

It contains:

* `index.html`
* `style.css`
* `script.js`

No backend service, database, package manifest, or application runtime dependency is required.

Because the application is static, some common security controls were assessed for applicability rather than artificially introduced.

## Architecture

```text
                    Host
                     │
                     │ :8088
                     ▼
        ┌─────────────────────────────┐
        │ Docker Container            │
        │                             │
        │ Nginx                       │
        │ User: nginx                 │
        │                             │
        │ Read-only root filesystem   │
        │ /tmp → restricted tmpfs     │
        │ Capabilities → ALL dropped │
        │ no-new-privileges           │
        │                             │
        │ Static Web Application      │
        └──────────────┬──────────────┘
                       │
                 hardened-web
                  Docker network
```

## Baseline Security Assessment

The Project 1 container was inspected before hardening.

Baseline findings included:

* Nginx master process running as `root`.
* Default Linux capabilities were retained.
* The root filesystem was writable.
* The base image used the floating `nginx:alpine` tag.
* The container did not explicitly prevent privilege escalation.

The baseline evidence is stored in:

```text
evidence/baseline/
```

### Baseline Runtime

The original Project 1 container reported:

```text
User=
Privileged=false
ReadonlyRootfs=false
CapDrop=null
CapAdd=null
SecurityOpt=null
```

The Nginx master process ran as:

```text
PID 1 root nginx: master process
```

The baseline capability set was non-zero.

The baseline filesystem test also demonstrated that locations such as `/etc` and `/tmp` were writable.

## Security Hardening Process

### 1. Non-root execution

The Dockerfile was changed to run Nginx as the built-in `nginx` user:

```dockerfile
USER nginx
```

The final process inspection confirms that the Nginx master and worker processes run as `nginx`.

Evidence:

```text
evidence/final/processes.txt
evidence/final/compose-processes.txt
```

### 2. Drop all Linux capabilities

The final runtime uses:

```yaml
cap_drop:
  - ALL
```

Runtime inspection confirms:

```text
CapDrop=[ALL]
```

PID 1 also reports zero capabilities across the inherited, permitted, effective, bounding, and ambient sets:

```text
CapInh: 0000000000000000
CapPrm: 0000000000000000
CapEff: 0000000000000000
CapBnd: 0000000000000000
CapAmb: 0000000000000000
```

Evidence:

```text
evidence/final/compose-capabilities.txt
```

### 3. Prevent privilege escalation

The final runtime uses:

```yaml
security_opt:
  - no-new-privileges:true
```

This prevents processes inside the container from gaining additional privileges through mechanisms such as set-user-ID or set-group-ID execution.

### 4. Read-only root filesystem

The final Compose deployment uses:

```yaml
read_only: true
```

This prevents normal writes to the container's root filesystem.

The application initially failed when this control was enabled because Nginx required a writable location for its PID and temporary files.

Instead of disabling the control, the container was redesigned to provide only the writable storage Nginx actually requires.

### 5. Restricted writable `/tmp`

The final container provides:

```yaml
tmpfs:
  - /tmp:rw,noexec,nosuid,nodev,size=64m
```

This provides a temporary writable filesystem while applying:

* `noexec`
* `nosuid`
* `nodev`
* 64 MB size limit

Nginx temporary paths and its PID file are configured to use `/tmp`.

### 6. Custom Nginx configuration

The container uses a dedicated `nginx.conf`.

Important configuration decisions include:

```nginx
error_log /dev/stderr notice;
pid /tmp/nginx.pid;

access_log /dev/stdout;
```

Nginx listens internally on:

```nginx
listen 8080;
```

The application is served from:

```text
/usr/share/nginx/html
```

The custom configuration also directs temporary files to `/tmp`.

### 7. Base image digest pinning

The original Dockerfile used:

```dockerfile
FROM nginx:alpine
```

The final Dockerfile uses a content-addressed digest:

```dockerfile
FROM nginx@sha256:62ff2089abf5a9ed33bd232895bef5e22f7bb4b200675cec49a5ebc48e3d4ac8
```

This prevents the build from silently following a moving `nginx:alpine` tag.

Evidence:

```text
evidence/final/base-image.txt
```

### 8. Vulnerability remediation

The initial final-image scan identified:

```text
CVE-2026-93990
Severity: HIGH
Package: libexpat
Installed: 2.8.4-r0
Fixed: 2.8.5-r0
```

The Dockerfile was updated to upgrade Alpine packages during the image build:

```dockerfile
RUN apk upgrade --no-cache \
    && mkdir -p \
        /tmp/client_temp \
        /tmp/proxy_temp \
        /tmp/fastcgi_temp \
        /tmp/uwsgi_temp \
        /tmp/scgi_temp \
    && chown -R nginx:nginx /tmp \
    && chown -R nginx:nginx /usr/share/nginx/html
```

The final image confirms:

```text
libexpat-2.8.5-r0 [installed]
```

Evidence:

```text
evidence/final/libexpat-remediation.txt
```

The final Trivy scan reports:

```text
Vulnerabilities: 0
```

Evidence:

```text
evidence/final/trivy-image.txt
```

## Before vs After

| Security Control           | Project 1 Baseline          | Project 2 Final                    |
| -------------------------- | --------------------------- | ---------------------------------- |
| User                       | Root                        | `nginx`                            |
| Root filesystem            | Writable                    | Read-only                          |
| Linux capabilities         | Default set                 | `ALL` dropped                      |
| PID 1 capabilities         | Non-zero                    | All zero                           |
| Privilege escalation       | Not explicitly restricted   | `no-new-privileges`                |
| Writable temporary storage | Normal filesystem           | Restricted `/tmp` tmpfs            |
| Base image                 | Floating `nginx:alpine`     | Digest pinned                      |
| OS vulnerability scan      | 0 findings at baseline scan | 0 findings after remediation       |
| Container network          | Project 1 default network   | Dedicated `hardened-web` network   |
| Application validation     | Working                     | HTTP 200                           |
| Process user               | Root master process         | All Nginx processes run as `nginx` |

## Validation

The final container was deployed with Docker Compose and validated at runtime.

### Container status

```text
docker-lab-app-hardened
folarin-docker-app:hardened-v4
Up
```

### HTTP validation

```text
HTTP/1.1 200 OK
Server: nginx/1.31.6
```

Evidence:

```text
evidence/final/http-test.txt
```

### Final runtime security configuration

```text
User=nginx
ReadonlyRootfs=true
CapDrop=[ALL]
SecurityOpt=[no-new-privileges:true]
Tmpfs=/tmp:rw,noexec,nosuid,nodev,size=64m
Privileged=false
```

Evidence:

```text
evidence/final/compose-runtime.txt
```

### Compose configuration

The final deployment is defined in:

```text
docker-compose.yml
```

The resolved configuration is captured in:

```text
evidence/final/compose-config.txt
```

The Compose configuration confirms:

* Dedicated `hardened-web` network.
* Read-only root filesystem.
* All capabilities dropped.
* `no-new-privileges`.
* Restricted `/tmp` tmpfs.
* Non-privileged container.
* Persistent restart policy.

## Applicability Decisions

Not every security control is meaningful for this particular application.

### Application dependency pinning

The application is a static HTML/CSS/JavaScript site and contains no application package manager or dependency manifest.

There are therefore no application dependencies to pin.

The relevant supply-chain control for this project is base-image digest pinning.

### Runtime secrets

The application does not require credentials, API keys, database passwords, certificates, or other runtime secrets.

No secret was artificially introduced merely to demonstrate secret management.

Trivy's secret scanner was enabled during the final image scan.

### Multi-tier network segmentation

The application consists of a single static web container.

There is no backend or database service requiring service-to-service segmentation.

A dedicated Docker network was nevertheless defined for the hardened deployment to establish an explicit network boundary without falsely representing the project as a multi-tier architecture.

## Repository Structure

```text
project-2-container-security-hardening/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── index.html
├── style.css
├── script.js
├── README.md
└── evidence/
    ├── baseline/
    ├── hardened-v1/
    └── final/
```

## Running the Project

Build and start the hardened application:

```bash
docker compose up -d --build
```

Check the deployment:

```bash
docker compose ps
```

Test the application:

```bash
curl -I http://localhost:8088
```

Expected result:

```text
HTTP/1.1 200 OK
```

Stop the deployment:

```bash
docker compose down
```

## Security Lessons Learned

This project demonstrated that container security is not simply about scanning an image for CVEs.

The baseline image initially had no detected vulnerabilities, but the container still had unnecessary privileges and filesystem access.

The project therefore focused on reducing runtime attack surface through:

* Least-privilege execution.
* Capability reduction.
* Privilege-escalation prevention.
* Read-only filesystems.
* Restricted writable storage.
* Base-image pinning.
* Vulnerability remediation.
* Runtime validation.
* Reproducible security configuration through Docker Compose.

The most important lesson was that security controls must be validated against the actual workload. When the read-only filesystem initially prevented Nginx from starting, the solution was not to remove the control. The container was redesigned to provide only the writable storage Nginx required.

## Project Outcome

The original Project 1 application continues to serve the same static web content, but Project 2 significantly reduces the privileges and writable surface available to the container.

The final implementation combines:

```text
Digest-pinned base image
        +
Non-root execution
        +
ALL capabilities dropped
        +
No-new-privileges
        +
Read-only root filesystem
        +
Restricted /tmp
        +
Dedicated Docker network
        +
Vulnerability remediation
        +
Runtime validation
```

The final image reports **0 vulnerabilities in the Trivy scan**, and the hardened application continues to return **HTTP 200 OK** through the Compose-managed deployment.
