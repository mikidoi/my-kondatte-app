import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MealCardProps {
  recipeName: string;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function MealCard({ recipeName, onDelete, isDeleting }: MealCardProps) {
  return (
    <Box
      sx={{
        bgcolor: "#e8ecda",
        borderRadius: 1.5,
        px: 1,
        py: 0.75,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500 }}>
        {recipeName}
      </Typography>
      <IconButton
        size="small"
        onClick={onDelete}
        disabled={isDeleting}
        sx={{ ml: 0.5, flexShrink: 0 }}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
