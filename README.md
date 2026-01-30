# SubDub API (CredPal Backend Assessment)

![Node.js](https://img.shields.io/badge/Node.js-v20-green) ![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-blue) ![Express](https://img.shields.io/badge/Express-v5.0-black) ![License](https://img.shields.io/badge/License-ISC-yellow)

A robust Subscription Management API built for the CredPal Backend Assessment. This application allows users to track recurring expenses, manage renewal dates, and receive automated email reminders.

## 🚀 Key Features

* **Authentication:** Secure implementation using **Passport.js** strategies (Local & JWT).
    * Uses **Argon2** for industry-standard password hashing.
    * Implements **HTTP-Only Cookies** for secure token storage (Refresh/Access token rotation).
* **Subscription Logic:** Intelligent handling of recurring dates.
    * Automated calculation of `nextPaymentDate` based on frequency (Daily/Weekly/Monthly/Yearly).
    * "Upcoming Renewals" endpoint to filter bills due within 7 days.
* **Notifications:** Automated background workflow.
    * **Scheduler:** Runs daily at 9:00 AM to check for renewals.
    * **Smart Alerts:** Sends reminders 7, 5, 2, and 1 days before due dates.
    * **Templating:** Dynamic HTML email templates powered by **Resend**.
* **Architecture:** Feature-Based Modular Monolith.
    * Separation of Concerns: `Controller` -> `Service` -> `Model`.
    * Type-Safe Validation using **Zod**.
    * **OpenAPI/Swagger** documentation generated from code.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (v20+) & Express.js (v5 Beta)
* **Language:** TypeScript (Strict Mode)
* **Database:** MongoDB (Mongoose ODM)
* **Validation:** Zod
* **Auth:** Passport.js, Argon2, JWT
* **Infrastructure:** Node-Cron (Scheduler), Resend (Email)

---

## 🏗️ Architecture Decisions

### 1. Feature-Based Structure
Instead of the traditional technical layering (`controllers/`, `models/`), I organized code by **Domain Features** (`modules/users/`, `modules/subscriptions/`).
* **Reasoning:** This improves maintainability. All logic related to a specific domain (Validation, Routes, Service) is co-located, making it easier to scale or refactor.

### 2. Service Layer Pattern
Controllers are kept "thin." They only handle HTTP requests and responses. All business logic (e.g., calculating dates, checking permissions) resides in the `Service` layer.
* **Reasoning:** This ensures the business logic is reusable and testable independent of the HTTP framework.

### 3. Scheduler Implementation (Trade-off)
I implemented the notification system using **Node-Cron** (Polling).
* **Production Note:** In a high-scale environment with millions of users, I would replace this polling mechanism with an event-driven workflow engine like **Upstash Workflow** or **Temporal**. This would eliminate database polling and allow for persistent retries. For this assessment, `node-cron` was chosen for simplicity and ease of local setup for the reviewer.

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone <repository-url>
cd credpal-backend


## Author

👤 **Abdulmatin Adeniji**

* Github: [@matincodes](https://github.com/matincodes)