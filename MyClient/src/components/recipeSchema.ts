import { z } from "zod";

export const recipeSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  ingredients: z.string().min(10, "Please list at least a few ingredients"),

  instructions: z
    .string()
    .min(20, "Instructions should be detailed enough to follow"),

  file: z.instanceof(File, { message: "Please upload a photo" }).optional(),
});

export type RecipeInput = z.infer<typeof recipeSchema>;
