from fastapi import APIRouter
from app.api.api_v1.endpoints import novels, auth, world

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(novels.router, prefix="/novels", tags=["novels"])
api_router.include_router(world.router, tags=["world"])
