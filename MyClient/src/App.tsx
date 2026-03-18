import React, { useEffect, useState } from "react";
import RecipeCard from "./components/RecipeCard";
import "./App.css";
import "./index.css";

// Define the type for a recipe
interface Recipe {
  name: string;
  instructions: string;
  ingredients: string;
  imagePath?: string;
}

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/recipe")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Recipe[]) => {
        setRecipes(data);
      })
      .catch((err: Error) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Welcome to your Kondate App</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!error && recipes.length === 0 && <p>Loading data from API...</p>}

      <ul>
        {recipes.map((item, index) => {
          const defaultImageUrl = "http://localhost:5109/images/food.jpg";
          const imageUrl = `http://localhost:5109/images/${item.imagePath}`;
          return (
            <li key={index}>
              <RecipeCard
                title={item.name}
                description={item.instructions}
                imageUrl={imageUrl ?? defaultImageUrl}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
