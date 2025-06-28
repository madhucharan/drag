from typing import Union

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers import api_keys

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_keys.router, prefix="/keys", tags=["keys"])


@app.get("/")
def read_root():
    return {"Hello": "World"}
