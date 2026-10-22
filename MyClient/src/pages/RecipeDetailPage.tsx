import React from "react";
import { Alert, Box, CircularProgress, Grid, CardMedia, Card, CardContent, Link } from "@mui/material";
import { useParams, useSearchParams } from "react-router";

import { useRecipe } from "../shared/api/useRecipes";
import IngredientCard from "../shared/components/IngredientCard";
import InstructionCard from "../shared/components/InstructionCard";
import RecipeEditDialog from "../shared/components/RecipeEditDialog";

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { data, isLoading, isError, error } = useRecipe(numericId);
  const [searchParams, setSearchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const handleCloseEdit = () => setSearchParams({});

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Could not load recipe: {error.message}</Alert>;
  }

  if (!data) return null;

  const { name, description, ingredients, instructions, sourceUrl } = data;

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {sourceUrl && (
            <Card>
              <CardMedia sx={{ height: 140 }} image={sourceUrl} title={name} />
            </Card>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <Card>
            <CardContent>
              <h1>{name}</h1>
              <span>{description}</span>
              <div>
                <Link href={sourceUrl ?? "#"}>{sourceUrl}</Link>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {ingredients && <IngredientCard ingredients={ingredients} />}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          {instructions && <InstructionCard instructions={instructions} />}
        </Grid>
      </Grid>

      <RecipeEditDialog
        id={numericId}
        open={isEditMode}
        defaultValues={{ name, description, ingredients, instructions, sourceUrl: sourceUrl ?? "" }}
        onClose={handleCloseEdit}
      />
    </>
  );
};

export default RecipeDetailPage;
