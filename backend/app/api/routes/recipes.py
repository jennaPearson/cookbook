from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.scraper import get_recipe_from_url, get_recipe_from_html
from sqlalchemy.orm import Session
from app.schemas.recipe import RecipeCreate, RecipeInDB
from app.crud.recipe_crud import create_recipe, get_all_recipes, delete_recipe, get_recipe_by_id
from app.db.session import SessionLocal
import logging
import traceback

logger = logging.getLogger(__name__)
router = APIRouter()

class URLPayload(BaseModel):
    url: str

class HTMLPayload(BaseModel):
    html: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=RecipeInDB)
def add_recipe(recipe: RecipeCreate, db: Session = Depends(get_db)):
    return create_recipe(db, recipe)

@router.get("/", response_model=list[RecipeInDB])
def list_recipes(db: Session = Depends(get_db)):
    return get_all_recipes(db)

@router.get("/view/{recipe_id}", response_model=RecipeInDB)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.delete("/{recipe_id}")
def remove_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = delete_recipe(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"detail": "Recipe deleted"}

@router.post("/scrape-url/")
def scrape_recipe_url(payload: URLPayload):
    try:
        return get_recipe_from_url(payload.url)
    except Exception as e:
        logger.error(f"Failed to scrape URL {payload.url}: {e}")
        logger.debug(traceback.format_exc())
        raise HTTPException(status_code=400, detail="Failed to scrape from URL")

@router.post("/scrape-html/")
def scrape_recipe_html(payload: HTMLPayload):
    print("Received payload type:", type(payload.html))
    print("Payload length:", len(payload.html))
    try:
        return get_recipe_from_html(payload.html)
    except Exception as e:
        logger.error(f"Failed to parse recipe from HTML: {e}")
        logger.debug(traceback.format_exc())
        raise HTTPException(status_code=400, detail="Failed to parse recipe from HTML")
