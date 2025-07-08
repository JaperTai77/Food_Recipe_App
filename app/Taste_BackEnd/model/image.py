from pydantic import BaseModel

class Image(BaseModel):
    user_prompt:str
    cuisine_name:str

class Response(BaseModel):
    image_base64:str