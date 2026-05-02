import React from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import { WeeklyMenuPage } from "./pages/weekly-menu/WeeklyMenuPage";
import { RecipeListPage } from "./pages/recipes/RecipeListPage";
import { RecipeDetailPage } from "./pages/recipe-detail/RecipeDetailPage";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<WeeklyMenuPage />} />
        <Route path="/recipes" element={<RecipeListPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
};

export default App;
