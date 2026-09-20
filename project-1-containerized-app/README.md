# ☁️ Cloud Ops Challenge

> An interactive Cloud and DevOps learning game built with HTML, CSS, JavaScript, Docker, Docker Compose, Nginx, and Alpine Linux.

**Built by Folarin Koyum**

---

## 📌 Project Overview

Cloud Ops Challenge is an interactive browser-based quiz game designed around fundamental Cloud, DevOps, Docker, Linux, and networking concepts.

The application is packaged as a Docker container and served through Nginx running on Alpine Linux.

The project demonstrates how a lightweight web application can be containerized, exposed through a mapped port, and operated as a reproducible Docker workload.

---

## 🎯 Project Objectives

The project was built to demonstrate practical understanding of:

- Docker image creation
- Docker containers
- Docker Compose
- Nginx
- Alpine Linux
- Container networking
- Host-to-container port mapping
- Static web application deployment
- HTML, CSS, and JavaScript
- Container inspection and troubleshooting
- Basic DevOps workflow
- Git and GitHub portfolio management

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │   localhost:8080     │
                         └──────────┬───────────┘
                                    │
                              Port 8080
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │        Docker        │
                         │      Container       │
                         │                      │
                         │    Nginx / Alpine    │
                         │          │           │
                         │          ▼           │
                         │  HTML / CSS / JS     │
                         └──────────────────────┘
Request Flow
Browser
   │
   │ HTTP :8080
   ▼
Docker Host
   │
   │ Port mapping
   │ 8080 → 80
   ▼
docker-lab-app
   │
   ▼
Nginx
   │
   ▼
Static Web Application
🐳 Docker Architecture

The application uses the official Nginx Alpine image as its base image.

FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
Container Configuration
Component	Configuration
Base image	nginx:alpine
Container name	docker-lab-app
Docker image	folarin-docker-app:v1
Internal port	80
Host port	8080
Web server	Nginx
OS base	Alpine Linux
Network	Docker bridge network
⚙️ Docker Compose

The application is managed using Docker Compose.

services:
  web:
    build:
      context: .
    image: folarin-docker-app:v1
    container_name: docker-lab-app
    ports:
      - "8080:80"
    restart: unless-stopped
Start the Application
docker compose up -d --build
Stop the Application
docker compose down
View Container Status
docker compose ps
🎮 Application Features

Cloud Ops Challenge includes:

Interactive Cloud and DevOps questions
Randomized answer positions
Correct and incorrect answer feedback
XP scoring system
Streak bonuses
Accuracy calculation
Best streak tracking
Mission completion screen
Replay functionality
Responsive interface
Cloud/DevOps themed interface
Creator branding
Scoring System

Each correct answer awards:

100 XP base
+
25 XP for each additional consecutive correct answer

This creates a streak-based scoring system.

🧠 Topics Covered

The quiz currently covers foundational concepts including:

Cloud computing
Virtual machines
Object storage
Virtual networks
Load balancing
Containers
Docker images
Docker Compose
Nginx
Alpine Linux
📂 Project Structure
project-1-containerized-app/
│
├── Dockerfile
├── docker-compose.yml
├── index.html
├── style.css
├── script.js
├── README.md
│
└── screenshots/
    ├── 01-homepage.png
    ├── 02-challenge.png
    ├── 03-answer-feedback.png
    └── 04-results.png

## 🖥️ Application Screenshots

### Application Overview

The following screenshots demonstrate the Cloud Ops Challenge application from the initial homepage through an active challenge, answer feedback, and the final mission results.

#### 1. Application Homepage

![Cloud Ops Challenge Homepage](screenshots/01-homepage.png)

*The application homepage introducing the Cloud Ops Challenge.*

#### 2. Active Challenge

![Active Cloud Ops Challenge](screenshots/02-challenge.png)

*The active challenge interface where users interact with the application.*

#### 3. Answer Feedback

![Cloud Ops Challenge Answer Feedback](screenshots/03-answer-feedback.png)

*The answer feedback screen showing the result of a submitted challenge response.*

#### 4. Mission Complete

![Cloud Ops Challenge Mission Complete](screenshots/04-results.png)

*The final results screen showing completion of the Cloud Ops Challenge.*

---

Verification

The running container was verified using Docker Compose:

docker compose ps

Expected result:

NAME             IMAGE                   SERVICE   STATUS
docker-lab-app   folarin-docker-app:v1   web       Up

The application files were also verified inside the running container:

docker exec docker-lab-app ls -lh /usr/share/nginx/html/

The container contains:

index.html
script.js
style.css

HTTP availability was verified with:

curl -I http://localhost:8080

Expected response:

HTTP/1.1 200 OK
Server: nginx
Content-Type: text/html
🌐 Networking

The application uses Docker port mapping:

Host:      8080
Container: 80

Configured through Docker Compose:

ports:
  - "8080:80"

This means requests sent to:

http://localhost:8080

are forwarded to port 80 inside the Nginx container.

🛠️ Troubleshooting Experience

During development, the project demonstrated an important Docker deployment concept: files available on the host are not automatically available inside a container.

The initial Docker image only copied the HTML file.

As a result, the application structure inside the container did not contain all required frontend assets.

The Dockerfile was updated to explicitly copy:

index.html
style.css
script.js

into:

/usr/share/nginx/html/

The image was then rebuilt:

docker compose up -d --build

The container filesystem was subsequently verified using:

docker exec docker-lab-app ls -lh /usr/share/nginx/html/

This confirmed that all required application assets were present.

📚 What I Learned
Docker
Building images from Dockerfiles
Running containers
Container lifecycle management
Port publishing
Inspecting containers
Understanding container filesystems
Docker Compose
Defining services
Building images
Managing containers
Configuring port mappings
Rebuilding applications after changes
Nginx
Serving static web content
Understanding containerized web servers
Using Nginx as the application frontend
Linux
Working with Alpine Linux
Inspecting container filesystems
Managing applications from the terminal
Networking
Host ports
Container ports
Docker bridge networking
HTTP connectivity testing
DevOps
Iterative development
Troubleshooting
Infrastructure configuration
Reproducible deployments
Documentation
Git-based version control
🚀 Future Improvements

Potential future improvements include:

Public cloud deployment
HTTPS
Custom domain
Persistent leaderboard
User profiles
Additional question categories
Difficulty levels
Cloud provider-specific challenges
Backend API
Database integration
CI/CD pipeline
Container image registry integration
Automated testing
🔐 Security Considerations

Security hardening is intentionally treated as a separate stage of the Docker portfolio.

This project focuses primarily on:

Containerization
Web serving
Networking
Docker Compose
Application functionality

Security hardening and production-oriented container controls will be explored in a subsequent project.

📈 Portfolio Value

This project demonstrates practical experience with:

Docker
Docker Compose
Nginx
Alpine Linux
Container Networking
HTML
CSS
JavaScript
Linux
Git
DevOps
Cloud Fundamentals

It represents the first project in my Docker portfolio and establishes the foundation for progressively more advanced container, security, and DevOps projects.

👤 Author

Folarin Koyum

Cloud / DevOps / Cybersecurity Enthusiast

📜 License

This project is intended for educational and portfolio purposes.
