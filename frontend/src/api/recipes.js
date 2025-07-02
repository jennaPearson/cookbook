import axios from "axios"

const BASE_URL = "http://localhost:8000/recipes"


export const deleteRecipe = (id) => 
  axios.delete(`${BASE_URL}/${id}`)

export const saveRecipe = (recipe) => 
  axios.post(`${BASE_URL}/`, recipe)

export const getRecipes = () => axios.get(BASE_URL)

export const scrapeRecipeByUrl = (url) =>
  axios.post(`${BASE_URL}/scrape-url/`, { url })

export const scrapeRecipeFromHtml = (html) =>
  axios.post(`${BASE_URL}/scrape-html/`, { html: html })
