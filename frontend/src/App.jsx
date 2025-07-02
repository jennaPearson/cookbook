import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import AddRecipe from "./pages/AddRecipe"
import ViewRecipe from "./pages/ViewRecipe"

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        <h1>Hello from React</h1>
        <nav className="mb-4 space-x-4">
          <Link to="/">Home</Link>
          <Link to="/add">Add Recipe</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/recipes/:id" element={<ViewRecipe />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
