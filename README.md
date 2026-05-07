# yny-app

An integrated ERP and AI-driven management solution.

## Overview
`yny-app` is a modern web application designed to streamline business operations by combining robust ERP functionality with intelligent AI processing. This system serves as the central hub for managing organizational data and leveraging automated insights.

## Project Architecture
The system is composed of three primary components:

*   **Frontend**: A responsive web interface built with Vite and React.
*   **ERP API**: The core backend service handling business logic, data persistence, and administrative operations.
*   **AI API**: A specialized service focused on processing data, generating insights, and managing intelligent workflows.

## Deployment Details
The application is currently live and accessible at: [https://yny-ui.vercel.app/](https://yny-ui.vercel.app/)

### Environment Configuration
To run or develop the application, ensure the following environment variables are configured:

| Variable | Endpoint |
| :--- | :--- |
| `VITE_ERP_API` | `[https://erp-api-158766252751.us-central1.run.app](https://erp-api-158766252751.us-central1.run.app)` |
| `VITE_AI_API` | `[https://ai-api-158766252751.us-central1.run.app](https://ai-api-158766252751.us-central1.run.app)` |

## Getting Started
To get a local copy up and running, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/kheai/yny-app
   cd yny-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add the API endpoints provided above.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Repository
For full source code, issue tracking, and contributions, visit the [official GitHub repository](https://github.com/kheai/yny-app).
```
