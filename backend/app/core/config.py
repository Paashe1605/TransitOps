from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TransitOps API"
    API_V1_STR: str = "/api/v1"
    
    # Postgres Database Config
    DATABASE_URL: str | None = None
    POSTGRES_SERVER: str = "localhost:5433"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "transitops"
    
    # Security Config
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE_FOR_HACKATHON"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            
            # Fix for asyncpg which doesn't accept 'sslmode'
            if "?sslmode=require" in url:
                url = url.replace("?sslmode=require", "?ssl=require")
            elif "&sslmode=require" in url:
                url = url.replace("&sslmode=require", "&ssl=require")
                
            return url
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

settings = Settings()
