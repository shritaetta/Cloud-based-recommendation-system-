from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    user_service_url: str
    resume_service_url: str
    internship_service_url: str
    secret_key: str
    algorithm: str = "HS256"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False
    )


settings = Settings()