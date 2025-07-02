export default function RecipeCard({ recipe, onDelete }) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-1">{recipe.title}</h3>
      <ul className="text-xs mb-2 list-disc pl-4">
        {recipe.ingredient_names.slice(0, 3).map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
      <button onClick={onDelete} className="text-red-600">Delete</button>
    </div>
  )
}
