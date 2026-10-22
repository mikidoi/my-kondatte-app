import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import type { SaveRecipeDto } from "../api/useRecipes";
import { useCreateRecipe } from "../api/useRecipes";

interface RecipeCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const emptyValues: SaveRecipeDto = {
  name: "",
  description: "",
  ingredients: "",
  instructions: "",
  sourceUrl: "",
};

export default function RecipeCreateDialog({ open, onClose }: RecipeCreateDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SaveRecipeDto>({
    defaultValues: emptyValues,
  });
  const { mutate, isPending } = useCreateRecipe();

  const handleClose = () => {
    reset(emptyValues);
    onClose();
  };

  const onSubmit = (data: SaveRecipeDto) => {
    mutate(data, { onSuccess: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>New Recipe</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            {...register("name", { required: "Required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
          <TextField
            label="Description"
            {...register("description", { required: "Required" })}
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Ingredients"
            {...register("ingredients", { required: "Required" })}
            error={!!errors.ingredients}
            helperText={errors.ingredients?.message ?? "One per line"}
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            label="Instructions"
            {...register("instructions", { required: "Required" })}
            error={!!errors.instructions}
            helperText={errors.instructions?.message ?? "One step per line"}
            multiline
            rows={5}
            fullWidth
          />
          <TextField
            label="Source URL"
            {...register("sourceUrl")}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isPending}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
