import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { RecipeUpdateDto } from "../api/useRecipes";
import { useUpdateRecipe } from "../api/useRecipes";

interface RecipeEditDialogProps {
  id: number;
  open: boolean;
  defaultValues: RecipeUpdateDto;
  onClose: () => void;
}

export default function RecipeEditDialog({
  id,
  open,
  defaultValues,
  onClose,
}: RecipeEditDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RecipeUpdateDto>({
    defaultValues,
  });
  const { mutate, isPending } = useUpdateRecipe(id);

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  const onSubmit = (data: RecipeUpdateDto) => {
    mutate(data, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Recipe</DialogTitle>
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
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
