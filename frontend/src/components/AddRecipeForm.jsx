import { useState } from "react"
import axios from "axios"

export default function AddRecipeHybrid() {
  const [url, setUrl] = useState("")
  const [htmlSource, setHtmlSource] = useState("")
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState(null)
  const [showHtmlInput, setShowHtmlInput] = useState(false)

  async function handleSubmit() {
    setError(null)
    setRecipe(null)

    if (url) {
      // Try scraping from URL
      try {
        const res = await axios.post("http://localhost:8000/recipes/scrape-url/", { url })
        setRecipe(res.data)
        setShowHtmlInput(false)
      } catch (e) {
        setError("Scraping by URL failed. Please paste the recipe page HTML below.")
        setShowHtmlInput(true)
      }
    } else if (htmlSource) {
      // Try scraping from pasted HTML
      try {
        const res = await axios.post("http://localhost:8000/recipes/scrape-html/", { html: htmlSource })
        setRecipe(res.data)
      } catch {
        setError("Parsing from HTML source failed. Please check your input.")
      }
    } else {
      setError("Please enter a URL or paste the HTML source.")
    }
  }

  async function handleSave() {
    try {
      await axios.post("http://localhost:8000/recipes/", recipe)
      alert("Recipe saved!")
      setUrl("")
      setHtmlSource("")
      setRecipe(null)
      setShowHtmlInput(false)
      setError(null)
    } catch {
      alert("Failed to save recipe")
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter recipe URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={showHtmlInput}
        style={{ width: "100%", marginBottom: 10 }}
      />
      {showHtmlInput && (
        <textarea
          rows={15}
          cols={80}
          placeholder="Paste HTML source here..."
          value={htmlSource}
          onChange={(e) => setHtmlSource(e.target.value)}
        />
      )}
      <br />
      <button onClick={handleSubmit}>
        {showHtmlInput ? "Parse from HTML" : "Scrape from URL"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {recipe && (
        <div>
          <h3>Parsed Recipe Preview</h3>
          <pre>{JSON.stringify(recipe, null, 2)}</pre>
          <button onClick={handleSave}>Save Recipe</button>
        </div>
      )}
    </div>
  )
}
