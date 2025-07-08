from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from repository.recipe import RecipeRepository
from model.recipe import Recipe, Response

router = APIRouter(
    prefix="/recipe",
    tags=["recipe"]
)

@router.post("/chat")
async def chat(data: Recipe):
    recommender = RecipeRepository(data.user_prompt, data.cuisine_name)
    recipe = recommender.chat()
    response_json = jsonable_encoder(Response(recipe=recipe))
    return JSONResponse(content=response_json, status_code=200)