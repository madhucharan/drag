from typing import Union
from app.db.models import Base
from app.db.database import engine

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers import keys
from app.routers import users

app = FastAPI()

# Only in dev phase
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(keys.router, prefix="/keys", tags=["keys"])
app.include_router(users.router, prefix="/users", tags=["users"])


@app.get("/")
def read_root():
    return {"Hello": "World"}
