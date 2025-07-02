from pydantic import BaseModel
from typing import List, Optional

class RecipeBase(BaseModel):
    title: str
    author: Optional[str]
    category: Optional[str]
    cuisine: Optional[str]
    description: Optional[str]
    image: Optional[str]
    ingredients: List[str]
    ingredient_names: List[str]
    instructions: List[str]
    nutrients: Optional[dict]
    total_time: Optional[int]
    yields: Optional[str]

class RecipeCreate(RecipeBase):
    pass

class RecipeInDB(RecipeBase):
    id: int

    class Config:
        from_attributes = True
