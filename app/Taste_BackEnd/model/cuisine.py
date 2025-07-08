from pydantic import BaseModel


class Cuisine(BaseModel):
    user_prompt: str


class Response(BaseModel):
    cuisine: str