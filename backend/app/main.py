from fastapi import FastAPI
from app.db.session import Base, engine
from app.api.routes import recipes
import logging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(recipes.router, prefix="/recipes", tags=["recipes"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cookbook API! Use /recipes"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)