import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Link } from "react-router";

interface SubNavBarProps {
  backTo: string;
  onEdit?: () => void;
}

export default function SubNavBar({ backTo, onEdit }: SubNavBarProps) {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box
          component={Link}
          to={backTo}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.primary",
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
          <Typography variant="body2" component="span">
            Back
          </Typography>
        </Box>

        <Box />

        <Box sx={{ justifySelf: "end" }}>
          {onEdit && (
            <IconButton size="small" onClick={onEdit} aria-label="Edit">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
