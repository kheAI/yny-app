FROM python:3.12-slim

WORKDIR /app

# Install Cloud SQL Proxy
RUN apt-get update && apt-get install -y wget
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
RUN chmod +x cloud_sql_proxy

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

# Start Cloud SQL Proxy and the FastAPI app on port 8080
CMD ["sh", "-c", "./cloud_sql_proxy -instances=sensq-162608:us-central1:free-trial-first-project=tcp:5432 & python -m uvicorn main:app --host 0.0.0.0 --port 8080"]