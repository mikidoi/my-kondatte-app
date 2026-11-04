import { Box, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface WeekNavigatorProps {
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function WeekNavigator({ onPrev, onNext, onToday }: WeekNavigatorProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <IconButton onClick={onPrev}>
        <ChevronLeftIcon />
      </IconButton>
      <Button
        variant="outlined"
        size="small"
        onClick={onToday}
        sx={{ textTransform: "none", minWidth: 90 }}
      >
        This week
      </Button>
      <IconButton onClick={onNext}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
