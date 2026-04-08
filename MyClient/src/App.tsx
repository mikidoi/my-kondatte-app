import React, { useEffect, useState } from "react";
import RecipeCard from "./components/RecipeCard";
import "./App.css";
import "./index.css";
import RecipeForm from "./components/RecipeForm";

// Define the type for a recipe
interface Recipe {
  id: number;
  name: string;
  instructions: string;
  ingredients: string;
  image?: string;
}

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadRecipe = (newRecipe: any) => {
    const formData = new FormData();

    formData.append("name", newRecipe.name);
    formData.append("ingredients", newRecipe.ingredients);
    formData.append("instructions", newRecipe.instructions);

    if (newRecipe.image) {
      formData.append("file", newRecipe?.image);
    }

    fetch("/api/recipe/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setRecipes((prevRecipes) => [...prevRecipes, data]);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

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

      <RecipeForm onSubmit={uploadRecipe} />
      <ul style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recipes.map((item, index) => {
          const defaultImageUrl = "http://localhost:5109/images/food.jpg";
          const imageUrl = `http://localhost:5109/images/${item.imagePath}`;
          return (
            <li key={index}>
              <RecipeCard
                id={item.id}
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
