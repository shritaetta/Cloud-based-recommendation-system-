from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    user_service_url: str = "http://user-service:8001"
    resume_service_url: str = "http://resume-service:8002"
    internship_service_url: str = "http://internship-service:8003"
    secret_key: str = "your-super-secret-jwt-key"
    algorithm: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()
