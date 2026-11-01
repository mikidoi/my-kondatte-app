import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { useRecipe } from "../shared/api/useRecipes";
import RecipeDeleteDialog from "../shared/components/RecipeDeleteDialog";
import RecipeEditDialog from "../shared/components/RecipeEditDialog";

interface Recipe {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const numericId = Number(recipe.id);
  const { data: fullRecipe } = useRecipe(numericId, { enabled: editOpen });

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        {recipe.imageUrl && (
          <CardMedia
            sx={{ height: 140 }}
            image={recipe.imageUrl}
            title={recipe.name}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {recipe.name}
          </Typography>
          {recipe.description && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {recipe.description}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button
            size="small"
            component={RouterLink}
            to={`/recipes/${recipe.id}`}
          >
            Show Recipe
          </Button>
          <Button size="small" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </CardActions>
      </Card>

      {fullRecipe && (
        <RecipeEditDialog
          id={numericId}
          open={editOpen}
          defaultValues={{
            name: fullRecipe.name,
            description: fullRecipe.description,
            ingredients: fullRecipe.ingredients,
            instructions: fullRecipe.instructions,
            sourceUrl: fullRecipe.sourceUrl ?? "",
          }}
          onClose={() => setEditOpen(false)}
        />
      )}

      <RecipeDeleteDialog
        id={numericId}
        name={recipe.name}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
