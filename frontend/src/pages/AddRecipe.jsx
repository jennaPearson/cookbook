import { useState } from "react"
import { scrapeRecipeByUrl, scrapeRecipeFromHtml, saveRecipe } from "../api/recipes"

export default function AddRecipe() {
  const [mode, setMode] = useState("url") // "url" or "html"
  const [url, setUrl] = useState("")
  const [html, setHtml] = useState("")
  const [scraped, setScraped] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleScrape = async () => {
    setLoading(true)
    try {
      const res =
        mode === "url"
          ? await scrapeRecipeByUrl(url)
          : await scrapeRecipeFromHtml(html)

      setScraped(res.data)
    } catch (err) {
      console.error(err)
      alert("Scraping failed. Please check your input.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await saveRecipe(scraped)
      alert("Recipe saved!")
      setUrl("")
      setHtml("")
      setScraped(null)
    } catch (err) {
      console.error(err)
      alert("Saving failed")
    }
  }

  return (
    <div>
      <h2 className="text-xl mb-4">Add Recipe</h2>

      <div className="mb-4">
        <label className="mr-6">
          <input
            type="radio"
            name="mode"
            value="url"
            checked={mode === "url"}
            onChange={() => setMode("url")}
          />
          <span className="ml-1">Scrape from URL</span>
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="html"
            checked={mode === "html"}
            onChange={() => setMode("html")}
          />
          <span className="ml-1">Paste Full HTML</span>
        </label>
      </div>

      {mode === "url" ? (
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste recipe URL"
          className="border p-2 w-full max-w-xl mb-4"
        />
      ) : (
        <>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste the full page source (Ctrl+U → copy all)"
            className="border p-2 w-full h-64 font-mono text-sm mb-2"
          />
        </>
      )}

      <button
        onClick={handleScrape}
        disabled={loading}
        className="mr-2 p-2 bg-blue-500 text-white disabled:opacity-60"
      >
        {loading ? "Scraping..." : "Scrape"}
      </button>

      {scraped && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h3 className="text-lg font-bold">{scraped.title}</h3>
          {scraped.description && <p className="mb-2">{scraped.description}</p>}
          <button
            onClick={handleSave}
            className="p-2 bg-green-600 text-white"
          >
            Save to DB
          </button>
        </div>
      )}
    </div>
  )
}
