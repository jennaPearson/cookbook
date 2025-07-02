from recipe_scrapers import scrape_me, scrape_html
import re
import logging
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

def safe_scrape(scraper, method_name):
    try:
        method = getattr(scraper, method_name)
        return method()
    except Exception:
        return None
    
def get_ingredient_names(ingredients) -> list[str]:
    ingredients_names = set()
    for ingredient in ingredients:
        ingredients_names.add(clean_ingredient(ingredient, load_units()))

    return list(ingredients_names)

def load_units() -> list[str]:
    UNITS_FP = "units.txt"
    with open(UNITS_FP, 'r') as f:
        return [line.strip().lower() for line in f.readlines()]

def clean_ingredient(ingredient: str, units: list[str]) -> str:
    ingredient = ingredient.lower()
    #remove numbers and fractions
    ingredient = re.sub(r'(\d+\s)?\d+\/\d+|\d+(\.\d+)?', '', ingredient)

    for unit in units:
        pattern = r'\b' + re.escape(unit) + r'\b'
        ingredient = re.sub(pattern, '', ingredient)

    return ingredient.strip().strip(',')


def get_recipe_from_url(url: str):

    logger.info(f"Scraping recipe from URL: {url}")
    try:
        scraper = scrape_me(url)
        ingredients_raw = scraper.ingredients()
        ingredient_names = get_ingredient_names(ingredients_raw)

        recipe_data = {
            "title": scraper.title(),
            "author": scraper.author(),
            "category": scraper.category(),
            "cuisine": scraper.cuisine(),
            "description": scraper.description(),
            "image": scraper.image(),
            "ingredients": ingredients_raw,
            "ingredient_names": ingredient_names,
            "instructions": scraper.instructions_list(),
            "nutrients": scraper.nutrients(),
            "total_time": scraper.total_time(),
            "yields": scraper.yields()
        }

        logger.info(f"Successfully scraped: {recipe_data['title']}")
        return recipe_data

    except Exception as e:
        logger.exception("Error occurred while scraping recipe, try via HTML")
        raise


def get_recipe_from_html(html: str):
    logger.info("Parsing recipe from raw HTML")
    soup = BeautifulSoup(html, "html.parser")

    canonical_url = None
    canonical_tag = soup.find("link", rel="canonical")
    if canonical_tag and canonical_tag.get("href"):
        canonical_url = canonical_tag["href"]

    if canonical_url:
        try:
            scraper = scrape_html(html, canonical_url)
            ingredients_raw = scraper.ingredients()
            ingredient_names = get_ingredient_names(ingredients_raw)

            recipe_data = {
                "title": safe_scrape(scraper, "title"),
                "author": safe_scrape(scraper, "author"),
                "category": safe_scrape(scraper, "category"),
                "cuisine": safe_scrape(scraper, "cuisine"),
                "description": safe_scrape(scraper, "description"),
                "image": safe_scrape(scraper, "image"),
                "ingredients": ingredients_raw,
                "ingredient_names": ingredient_names,
                "instructions": safe_scrape(scraper, "instructions_list"),
                "nutrients": safe_scrape(scraper, "nutrients"),
                "total_time": safe_scrape(scraper, "total_time"),
                "yields": safe_scrape(scraper, "yields")
            }

            logger.info(f"Successfully parsed: {recipe_data['title']}")
            return recipe_data

        except Exception as e:
            logger.exception("Error occurred while parsing HTML recipe")
            raise
    print("Canonical URL not found")
    return None