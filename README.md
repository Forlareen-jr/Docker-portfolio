# Docker Portfolio 🐳

A hands-on Docker portfolio documenting my progression from containerizing applications to applying practical container security hardening techniques.

This repository contains two connected projects built around the same static Nginx application. The first project establishes the Docker fundamentals, while the second uses the same application as a baseline for security assessment, hardening, vulnerability remediation, and secure Docker Compose deployment.

The goal is not simply to demonstrate that I can run a container, but to demonstrate how I **inspect, secure, validate, and document containerized workloads**.

---

## Portfolio Overview

| Project                                                                               | Focus                                                                   | Status     |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------- |
| [Project 1 — Containerized App](./project-1-containerized-app/)                       | Docker fundamentals and application containerization                    | ✅ Complete |
| [Project 2 — Container Security Hardening](./project-2-container-security-hardening/) | Container security assessment, hardening, and vulnerability remediation | ✅ Complete |

---

## Project Progression

### Project 1 → Containerization

The first project established the foundation:

* Dockerfile creation
* Docker image building
* Container lifecycle management
* Nginx on Alpine Linux
* Port publishing
* Docker networking
* Docker Compose
* Application validation
* Image vulnerability scanning

**Objective:** Learn how to package and run a web application as a Docker container.

➡️ [View Project 1](./project-1-containerized-app/)

---

### Project 2 → Container Security Hardening

Project 2 builds directly on the Project 1 container rather than introducing an unrelated application.

The existing application was assessed from a security perspective and progressively hardened.

Key controls implemented include:

* Non-root container execution with `USER nginx`
* Dropping all Linux capabilities with `CAP_DROP=ALL`
* `no-new-privileges`
* Read-only container root filesystem
* Restricted `/tmp` using `tmpfs`
* `noexec`, `nosuid`, and `nodev` filesystem restrictions
* Digest-pinned Nginx base image
* OS package vulnerability remediation
* Trivy vulnerability scanning
* Docker Compose security configuration
* Dedicated Docker network
* Runtime capability and process validation

A HIGH-severity `libexpat` vulnerability identified during the hardening process was remediated by upgrading the affected package from `2.8.4-r0` to `2.8.5-r0`.

The final image scan reported **0 vulnerabilities**.

➡️ [View Project 2](./project-2-container-security-hardening/)

---

## Security Engineering Approach

The portfolio follows a practical security workflow:

```text
┌───────────────────────┐
│  Containerized App    │
│      Project 1        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Security Baseline   │
│                       │
│ • Runtime inspection  │
│ • Capabilities        │
│ • Processes           │
│ • Filesystem access   │
│ • Vulnerability scan  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    Hardening          │
│                       │
│ • Non-root            │
│ • Drop capabilities   │
│ • No-new-privileges   │
│ • Read-only rootfs    │
│ • Restricted /tmp     │
│ • Digest pinning      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Vulnerability         │
│ Discovery & Remediation│
│                       │
│ • Trivy scanning      │
│ • Package remediation │
│ • Verification        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Final Validation      │
│                       │
│ • Compose deployment  │
│ • HTTP 200            │
│ • Runtime inspection  │
│ • Capability checks   │
│ • Process checks      │
└───────────────────────┘
```

---

## Security Controls Demonstrated

| Control                         | Implementation                                  |
| ------------------------------- | ----------------------------------------------- |
| Non-root execution              | `USER nginx`                                    |
| Linux capability reduction      | `cap_drop: ALL`                                 |
| Privilege escalation prevention | `no-new-privileges:true`                        |
| Filesystem hardening            | `read_only: true`                               |
| Temporary filesystem isolation  | `/tmp` mounted as `tmpfs`                       |
| `/tmp` restrictions             | `noexec,nosuid,nodev`                           |
| Image supply-chain control      | Nginx image pinned by digest                    |
| Vulnerability management        | Trivy + package remediation                     |
| Network isolation               | Dedicated Docker bridge network                 |
| Runtime verification            | `docker inspect`, process and capability checks |
| Application validation          | HTTP response testing                           |

---

## Technology Stack

* **Docker**
* **Docker Compose**
* **Nginx**
* **Alpine Linux**
* **Trivy**
* **Linux**
* **Git**
* **GitHub**

---

## Evidence-Driven Documentation

Each project contains its own technical documentation and supporting evidence.

The portfolio emphasizes **verifiable implementation over unsupported claims**.

Evidence includes:

* Dockerfile configuration
* Docker Compose configuration
* Baseline runtime configuration
* Container security inspection
* Linux capability inspection
* Process inspection
* Trivy vulnerability reports
* Vulnerability remediation evidence
* Base image digest information
* Docker Compose resolved configuration
* Final runtime configuration
* HTTP validation
* Final image inspection

The security hardening project also preserves evidence from intermediate hardening stages to demonstrate the progression rather than presenting only the final configuration.

---

## Repository Structure

```text
docker-portfolio/
│
├── README.md
│
├── project-1-containerized-app/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── screenshots/
│   └── README.md
│
└── project-2-container-security-hardening/
    ├── Dockerfile
    ├── docker-compose.yml
    ├── nginx.conf
    ├── index.html
    ├── style.css
    ├── script.js
    ├── evidence/
    │   ├── baseline/
    │   ├── hardened-v1/
    │   └── final/
    └── README.md
```

---

## What This Portfolio Demonstrates

Through these projects, I have worked hands-on with:

* Building Docker images
* Writing Dockerfiles
* Running and inspecting containers
* Container networking
* Docker Compose
* Nginx configuration
* Linux container permissions
* Linux capabilities
* Container privilege reduction
* Read-only container filesystems
* Temporary filesystem configuration
* Image digest pinning
* Vulnerability scanning
* OS package remediation
* Security validation
* Evidence-based documentation

The projects also demonstrate an important engineering workflow:

> **Build → Inspect → Identify Risk → Harden → Validate → Document**

---

## Portfolio Status

### Docker Portfolio — 2/2 Projects Complete

* [x] Project 1 — Containerized Application
* [x] Project 2 — Container Security Hardening

Both projects are documented and maintained in this repository.

---

## Related Work

This Docker portfolio is part of my broader hands-on cloud and infrastructure learning journey, alongside my Azure projects and cloud security development.

The focus is on building practical skills through projects that can be inspected, reproduced, and explained rather than relying solely on course completion.

---

## Author

**Folarin Koyum**

Cloud & Infrastructure | Azure | Docker | Cloud Security

GitHub: [Forlareen-jr](https://github.com/Forlareen-jr)

LinkedIn: [Folarin Koyum](https://www.linkedin.com/in/folarin-koyum-340141346)

---

## License

This repository is intended primarily as a learning and professional portfolio project.
