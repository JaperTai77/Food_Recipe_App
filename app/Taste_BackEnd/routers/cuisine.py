from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from repository.cuisine import CuisineRepository
from model.cuisine import Cuisine, Response

router = APIRouter(
    prefix="/cuisine",
    tags=["cuisine"]
)

@router.post("/chat")
async def chat(data: Cuisine):
    recommender = CuisineRepository(data.user_prompt)
    cuisine = recommender.chat()
    response_json = jsonable_encoder(Response(cuisine=cuisine))
    return JSONResponse(content=response_json, status_code=200)