import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

import { useGetRecipes } from "../shared/api/useRecipes";
import RecipeCard from "./RecipeCard";
import RecipeCreateDialog from "../shared/components/RecipeCreateDialog";

export default function RecipePage() {
  const { data, isLoading, isError, error } = useGetRecipes();
  const [createOpen, setCreateOpen] = useState(false);

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
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <h1 style={{ margin: 0 }}>Recipes</h1>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          New recipe
        </Button>
      </Box>
      <Grid container spacing={2}>
        {data.map((recipe) => (
          <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>

      <RecipeCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
