<div align="center">
  <h1>⚡ OptiQueue</h1>
  <p><b>A Distributed, Asynchronous Image Processing API</b></p>

  [![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ankit3954/image-processor-optiqueue/pulls)

---

**[Postman API Documentation](https://documenter.getpostman.com/view/40033311/2sBXqKp16R)** • **[Project URL](https://roadmap.sh/projects/image-processing-service)**

---
  
</div>

---

OptiQueue is a decoupled, fault-tolerant microservice designed to handle heavy, CPU-intensive image transformations without blocking web traffic. By leveraging message brokering and distributed caching, it guarantees zero dropped tasks during high-traffic spikes.

## 📖 Table of Contents
- [Architecture & Flow](#-architecture--flow)
- [System Resilience](#-system-resilience)
- [Tech Stack](#-tech-stack)
- [API Reference](#-api-reference)
- [Local Installation](#-local-installation)
- [Project Structure](#-project-structure)

---

## 🏗️ Architecture & Flow

This project utilizes a **Publisher/Consumer microservice architecture** to maintain near-zero latency on the ingestion layer.

1. **Ingestion (Express API):** Receives the HTTP payload, validates the request, drops a transformation ticket into RabbitMQ, and instantly returns a `202 Accepted` response.
2. **Message Broker (RabbitMQ):** Queues the tasks. Decouples the API from the processing engine, providing a buffer against traffic surges.
3. **Processing Worker (Node.js):** Subscribes to the queue, fetches the raw image, executes the mathematical `sharp` transformations, stores the final asset in Cloudflare R2, and updates the MongoDB state.

---

## 🛡️ System Resilience

*   **API Rate Limiting:** A Redis-backed sliding window/token bucket algorithm protects endpoints from DDoS attacks, abuse, and localized traffic spikes.
*   **Asynchronous Retries:** RabbitMQ ensures guaranteed message delivery. If the worker crashes mid-process, the task is safely returned to the queue and retried upon recovery.
*   **Decoupled Scaling:** The HTTP server and the Background Worker can be scaled independently based on distinct CPU and memory requirements.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Core** | Node.js, TypeScript, Express.js |
| **Message Broker** | RabbitMQ (CloudAMQP) |
| **Database** | MongoDB Atlas (Mongoose) |
| **Cache & Security** | Redis (Rate Limiting) |
| **Blob Storage** | Cloudflare R2 |
| **Image Processing** | Sharp |
| **Deployment** | Render, Docker (Local Dev) |

---

## 📡 API Reference

For detailed payloads and examples, please view the **[Interactive Postman Documentation]**(`[Link to your Postman Docs]`).

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/image/:imageId/transform` | Submits an image for resizing, cropping, or format conversion. Returns a `jobId`. | No |
| `GET` | `/image/uploads` | Upload image to Cloudflare R2. | No |
| `GET` | `/image/:imageId` | Retrieves the final processed image URL from the database. | No |

---

## 🚀 Local Installation

### Prerequisites
* Node.js (v18 or higher)
* Docker & Docker Compose (for spinning up local Redis and RabbitMQ)

### 1. Clone & Install
```bash
git clone https://github.com/ankit3954/image-processor-optiqueue.git
cd image-processor-optiqueue
npm install
```
### 2. Environment Configuration
Ensure the following core variables are populated in your .env file:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/optiqueue
RABBITMQ_URL=amqp://localhost:5672
REDIS_URL=redis://localhost:6379
R2_BUCKET_NAME=your_r2_bucket
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_ENDPOINT=your_cloudflare_endpoint
```
---

### 3. Run the Services
To run both the ingestion API and the background worker concurrently in development mode:
```bash
npm run dev
npm run dev:worker
```

## 👤 Author

**Ankit Karn** – *Backend Developer*

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ankit3954)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ankitkarn3954/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ankitkarn.11184@gmail.com)
