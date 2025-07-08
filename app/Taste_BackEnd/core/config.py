import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    OPENAI_KEY: str = os.getenv("OPENAI_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

Variable = Settings()