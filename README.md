# yny-app: AI-Powered Domain-Expert Agentic ERP System

This repository contains an industrial-grade, microservices-based SaaS prototype that integrates secure ERP inventory management with a specialized AI troubleshooting agent. 

## Live Deployment
The system is fully deployed and accessible via the following environments:
* **Production UI:** [https://yny-ui.vercel.app/](https://yny-ui.vercel.app/)
* **ERP Logic API:** [https://erp-api-158766252751.us-central1.run.app](https://erp-api-158766252751.us-central1.run.app)
* **AI Logic API:** [https://ai-api-158766252751.us-central1.run.app](https://ai-api-158766252751.us-central1.run.app)
* **Repository:** [https://github.com/kheai/yny-app](https://github.com/kheai/yny-app)

## System Architecture & Tech Stack
To ensure data integrity and prevent logical entanglement, the application utilizes a strict microservices architecture.

* **Data Tier:** Google Cloud SQL (PostgreSQL) configured with the `pgvector` extension to handle both relational business data and mathematical AI memory arrays.
* **Logic Tier (ERP):** A type-safe .NET 8 Web API designed for fast, secure delivery of structured inventory data.
* **Logic Tier (AI):** A Python FastAPI service executing Retrieval-Augmented Generation (RAG) workflows. It converts text to vectors via `gemini-embeddings-1` and generates human-readable resolutions using `gemini-3.1-flash-lite-preview`.
* **Presentation Tier:** A responsive dashboard built with React and Vite.
* **Hosting:** Google Cloud Run handles the serverless, auto-scaling backend deployments, while the frontend is deployed via Vercel.

## Repository Structure
The codebase is segmented into three independent components:
* `/yny.Api`: Contains the C# .NET 8 Backend source code.
* `/yny.AI`: Contains the Python AI Service, RAG pipelines, and database seeding scripts.
* `/yny-ui`: Contains the React Frontend application.

## Local Setup & Verification

To replicate the environment for local development or auditing, execute the following validated steps:

### 1. Database Provisioning
* Provision a Google Cloud SQL PostgreSQL Enterprise instance.
* Execute the provided initialization script to enable the `vector` extension, build the `Products` and `manual_knowledge` tables, and insert test data.

### 2. ERP API Setup
* Navigate to the `/yny.Api` directory.
* Update `appsettings.json` with your verified `DefaultConnection` string, utilizing your database's Public IP.
* Initialize the server using `dotnet run`.

### 3. AI API Setup
* Navigate to the `/yny.AI` directory and activate a Python 3.10+ virtual environment.
* Install required packages via `pip install -r requirements.txt`.
* Create a `.env` file detailing your `GCP_PROJECT_ID`, `GCP_LOCATION`, and PostgreSQL `DB_URL`.
* Run `python seed.py` to embed and store the initial industrial manuals into the database.
* Start the FastAPI instance using `uvicorn main:app --host 0.0.0.0 --port 8080`.

### 4. Frontend Setup
* Navigate to `/yny-ui`.
* Define the `VITE_ERP_API` and `VITE_AI_API` environment variables in a `.env.production` or standard `.env` file.
* Execute `npm install` followed by `npm run dev` to launch the local interface.

## System Validation (Demo Workflow)
To verify the system's end-to-end functionality, follow this prescribed workflow:
1.  Observe the live dashboard populating inventory directly from the PostgreSQL instance via the .NET 8 API.
2.  Input a specialized engineering query into the AI module, such as investigating a crackling noise associated with equipment `PUMP-CENT-001`.
3.  The Python service translates the query into a vector, queries the `pgvector` database via Cosine Distance, retrieves the exact manual excerpt, and commands the Gemini model to synthesize a professional resolution.
