import type { ScannedRecipeResult } from "../types/recipe";

export const recipeApi = {
  uploadRecipe: async (request: FormData) => {
    const response = await fetch("/api/recipe/upload", {
      method: "POST",
      body: request,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  scanRecipe: async (file: File, targetLanguage: string): Promise<ScannedRecipeResult> => {
    const form = new FormData();
    form.append("file", file);
    form.append("targetLanguage", targetLanguage);
    const response = await fetch("/api/recipe/scan", { method: "POST", body: form });
    if (!response.ok) throw new Error(`Scan failed: ${response.status}`);
    return response.json();
  },

  editRecipe: async (id: number, request: FormData): Promise<void> => {
    const response = await fetch(`/api/recipe/${id}`, {
      method: "PUT",
      body: request,
    });
    if (!response.ok) throw new Error(`Edit failed: ${response.status}`);
  },
};
