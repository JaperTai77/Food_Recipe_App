from pydantic import BaseModel


class Recipe(BaseModel):
    user_prompt:str
    cuisine_name:str


class Response(BaseModel):
    recipe: str