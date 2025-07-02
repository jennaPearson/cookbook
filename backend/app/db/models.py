from sqlalchemy import Column, Integer, String, JSON
from app.db.session import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String)
    description = Column(String)
    ingredients = Column(JSON)
    ingredient_names = Column(JSON)
    instructions = Column(JSON)
    image = Column(String)
    category = Column(String)
    cuisine = Column(String)
    nutrients = Column(JSON)
    total_time = Column(Integer)
    yields = Column(String)
