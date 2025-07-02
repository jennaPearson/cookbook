import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"


export default function ViewRecipe() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:8000/recipes/view/${id}`)
    .then((res) => setRecipe(res.data))
      .catch((err) => console.error("Error loading recipe", err))
  }, [id])

  if (!recipe) return <p>Loading...</p>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{recipe.title}</h2>
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="max-w-md rounded" />}
      <p><strong>Author:</strong> {recipe.author || "N/A"}</p>
      <p><strong>Cuisine:</strong> {recipe.cuisine || "N/A"}</p>
      <p><strong>Category:</strong> {recipe.category || "N/A"}</p>
      <p><strong>Description:</strong> {recipe.description || "No description provided."}</p>
      <p><strong>Total Time:</strong> {recipe.total_time} min</p>
      <p><strong>Yields:</strong> {recipe.yields}</p>

      <div>
        <h3 className="text-lg font-semibold mt-4">Ingredients</h3>
        <ul className="list-disc pl-5">
          {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-4">Instructions</h3>
        <ol className="list-decimal pl-5">
          {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </div>

      {recipe.nutrients && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Nutritional Info</h3>
          <ul className="list-disc pl-5">
            {Object.entries(recipe.nutrients).map(([key, val]) => (
              <li key={key}><strong>{key}:</strong> {val}</li>
            ))}
          </ul>
        </div>
      )}
      <Link to="/" className="text-blue-500 underline">← Back to Recipes</Link>

    </div>
  )
}
