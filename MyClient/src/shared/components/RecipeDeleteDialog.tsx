import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDeleteRecipe } from "../api/useRecipes";

interface RecipeDeleteDialogProps {
  id: number;
  name: string;
  open: boolean;
  onClose: () => void;
}

export default function RecipeDeleteDialog({
  id,
  name,
  open,
  onClose,
}: RecipeDeleteDialogProps) {
  const { mutate, isPending } = useDeleteRecipe();

  const handleConfirm = () => {
    mutate(id, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Recipe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={isPending}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
