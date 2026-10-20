import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";

import { useRecipes } from "../shared/api/useRecipes";
import RecipeCard from "./RecipeCard";

export default function RecipePage() {
  const { data, isLoading, isError, error } = useRecipes();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">Could not load recipes: {error.message}</Alert>
    );
  }

  if (!data || data?.length === 0) {
    return <Typography color="text.secondary">No recipes yet.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {data.map((recipe) => (
        <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <RecipeCard recipe={recipe} />
        </Grid>
      ))}
    </Grid>
  );
}
