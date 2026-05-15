export interface Recipe {
  id: number;
  name: string;
  description: string;
  category: string;
  preparationTime: number;
  servesCount: number;
  ingredients: string;
  instructions: string;
  imagePath?: string;
}

export interface ScannedRecipeResult {
  name: string;
  description: string;
  category: string;
  ingredients: string;
  instructions: string;
  detectedLanguage: string;
}
