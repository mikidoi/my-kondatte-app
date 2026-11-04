import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type PlannedMealDto } from "../api/useMealPlan";
import MealCard from "./MealCard";

interface DayColumnProps {
  label: string;
  dateLabel: string;
  meal?: PlannedMealDto;
  isWeekend: boolean;
  isLast: boolean;
  onAddMeal: () => void;
  onDeleteMeal: () => void;
  isDeleting: boolean;
}

export default function DayColumn({
  label,
  dateLabel,
  meal,
  isWeekend,
  isLast,
  onAddMeal,
  onDeleteMeal,
  isDeleting,
}: DayColumnProps) {
  return (
    <Box
      sx={{
        borderRight: isLast ? "none" : "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        minHeight: 280,
      }}
    >
      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", px: 1.5, py: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{label}</Typography>
        <Typography variant="caption">{dateLabel}</Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          bgcolor: isWeekend ? "background.default" : "background.paper",
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {meal && (
          <MealCard
            recipeName={meal.recipe?.name ?? ""}
            onDelete={onDeleteMeal}
            isDeleting={isDeleting}
          />
        )}

        <Box sx={{ flex: 1 }} />

        {!meal && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={onAddMeal}
            sx={{
              border: "1.5px dashed",
              borderColor: "divider",
              borderRadius: 1.5,
              color: "text.secondary",
              textTransform: "none",
              "&:hover": { borderColor: "primary.main", color: "primary.main" },
            }}
          >
            Add meal
          </Button>
        )}
      </Box>
    </Box>
  );
}
