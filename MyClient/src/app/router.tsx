import { createBrowserRouter } from "react-router";

import Layout from "./Layout";
import RecipePage from "../pages/RecipePage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import MealPlanPage from "../pages/MealPlanPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/recipes", element: <RecipePage /> },
      { path: "/recipes/:id", element: <RecipeDetailPage /> },
      { path: "/", element: <MealPlanPage /> },
    ],
  },
]);
