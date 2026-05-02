interface Recipe {
  imagePath?: string;
}

function getImageUrl(recipe: Recipe): string | null {
  return recipe.imagePath
    ? `http://localhost:5109/images/${recipe.imagePath}`
    : null;
}

export default getImageUrl;
