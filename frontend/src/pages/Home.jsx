import { useEffect, useState } from "react"
import { getRecipes } from "../api/recipes"
import { Link } from "react-router-dom"

export default function Home() {
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    getRecipes().then((res) => setRecipes(res.data))
  }, [])

  return (
    <div>
      <h2 className="text-xl mb-4">Saved Recipes</h2>
      <ul className="space-y-2">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="border p-2 rounded hover:bg-gray-50">
            <Link to={`/recipes/${recipe.id}`} className="text-blue-600 hover:underline">
              {recipe.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
