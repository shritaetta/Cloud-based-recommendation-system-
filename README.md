# AI-Powered Cloud-Based Internship Recommendation System

A cloud-based microservices architecture for an AI-powered internship recommendation system.

## Architecture

This project is built using:
- **FastAPI** for microservices and API Gateway
- **PostgreSQL** with separate databases for each microservice
- **Docker & Docker Compose** for containerization and orchestration
- **JWT** for authentication
- **Asyncpg & SQLAlchemy 2.0** for async database operations

## Microservices
1. **API Gateway**: Reverse proxy and authentication layer. (Port `8000`)
2. **User Service**: Manages users and student profiles. (Port `8001`)

## Setup Instructions

1. Clone the repository.
2. Build and start the services using Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
3. Once the database is ready, you need to generate and run the migrations for the User Service:
   ```bash
   docker-compose exec user-service alembic revision --autogenerate -m "Initial migration"
   docker-compose exec user-service alembic upgrade head
   ```

## API Documentation
Once running, you can view the Swagger documentation for the API Gateway and User Service at:
- API Gateway: http://localhost:8000/docs
- User Service: http://localhost:8001/docs
