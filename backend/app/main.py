from typing import Union
from dotenv import load_dotenv
from app.db.models import Base
from app.db.database import engine

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers import keys
from app.routers import users
from app.routers import webhooks


load_dotenv()

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
app.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])


@app.get("/")
def read_root():
    return {"Hello": "World"}
