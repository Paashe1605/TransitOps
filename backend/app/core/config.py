from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TransitOps API"
    API_V1_STR: str = "/api/v1"
    
    # Postgres Database Config
    POSTGRES_SERVER: str = "localhost:5433"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "transitops"

    USE_SQLITE: bool = True
    
    # Security Config
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE_FOR_HACKATHON"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.USE_SQLITE:
            return "sqlite+aiosqlite:///./dev.db"
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

settings = Settings()
