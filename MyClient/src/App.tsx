import React, { useEffect, useState } from "react";

// Define the type for a recipe
interface Recipe {
  name: string;
  instructions: string;
  ingredients: string;
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
      <h1>My Kondate App Connection Test</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!error && recipes.length === 0 && <p>Loading data from API...</p>}

      <ul>
        {recipes.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> - {item.instructions}
            <p>{item.ingredients}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
