from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from diffusers import DiffusionPipeline

from repository.image import ImageRepository
from model.image import Image, Response

router = APIRouter(
    prefix="/image",
    tags=["image"],
)

@router.post("/generate")
async def generate(data:Image):
    model_pipeline = DiffusionPipeline.from_pretrained("stable-diffusion-v1-5/stable-diffusion-v1-5")
    recommender = ImageRepository.move_to_gpu(data.user_prompt, data.cuisine_name, model_pipeline)
    imagebase64 = recommender.generate_image()
    response_json = jsonable_encoder(Response(image_base64=imagebase64))
    return JSONResponse(content=response_json, status_code=200)