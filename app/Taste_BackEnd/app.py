from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from routers import recipe, cuisine, image

app = FastAPI(
    title = "Taste Application",
    version="0.1",
    description="This is the backend for the food recommandation application"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:9000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipe.router, responses={404: {"description": "Not found"}})
app.include_router(cuisine.router, responses={404: {"description": "Not found"}})
app.include_router(image.router, responses={404: {"description": "Not found"}})