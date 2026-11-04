import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import type { components } from "../api/schema";

type RecipeDto = components["schemas"]["RecipeDto"];

interface RecipePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (recipeId: number) => void;
  recipes?: RecipeDto[];
  isPending: boolean;
}

export default function RecipePickerDialog({
  open,
  onClose,
  onSelect,
  recipes,
  isPending,
}: RecipePickerDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Pick a recipe</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List disablePadding>
          {recipes?.map((recipe) => (
            <ListItemButton
              key={recipe.id}
              onClick={() => onSelect(Number(recipe.id))}
              disabled={isPending}
            >
              <ListItemText
                primary={recipe.name}
                secondary={recipe.description}
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
