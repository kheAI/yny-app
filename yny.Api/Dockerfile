FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . .
RUN dotnet build && dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Install Cloud SQL Proxy
RUN apt-get update && apt-get install -y wget
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
RUN chmod +x cloud_sql_proxy

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "./cloud_sql_proxy -instances=sensq-162608:us-central1:free-trial-first-project=tcp:5432 & exec dotnet yny.Api.dll"]