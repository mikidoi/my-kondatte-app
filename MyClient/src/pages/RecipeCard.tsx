import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

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
  return (
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
        <Button size="small">Edit</Button>
        <Button
          size="small"
          component={RouterLink}
          to={`/recipes/${recipe.id}`}
        >
          Show Recipe
        </Button>
      </CardActions>
    </Card>
  );
}
