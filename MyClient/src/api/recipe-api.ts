export const recipeApi = {
  getRecipes: async (request: any) => {
    const response = await fetch("/api/recipe/upload", {
      method: "POST",
      body: request,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};
