interface Recipe {
  imagePath?: string;
}

function getImageUrl(recipe: Recipe): string | null {
  return recipe.imagePath
    ? `/images/${recipe.imagePath}`
    : null;
}

export default getImageUrl;
