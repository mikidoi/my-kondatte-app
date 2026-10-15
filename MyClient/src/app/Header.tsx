import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { NavLink } from "react-router";

const links = [
  { label: "Meal Plan", to: "/" },
  { label: "Recipes", to: "/recipes" },
];

const tint = (pct: number) =>
  `color-mix(in srgb, var(--mui-palette-primary-main) ${pct}%, transparent)`;

export default function Header() {
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
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
            }}
          >
            <HomeOutlinedIcon />
          </Box>
          <Typography
            variant="h5"
            component="span"
            sx={{ fontFamily: '"DM Serif Display", serif', fontWeight: 700 }}
          >
            Kondate
          </Typography>
        </Box>

        <Box component="nav" sx={{ display: "flex", gap: 1 }}>
          {links.map(({ label, to }) => (
            <Button
              key={to}
              component={NavLink}
              to={to}
              end={to === "/"}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 1,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                color: "text.secondary",
                "&.active": { color: "primary.main", bgcolor: tint(12) },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        <Box sx={{ justifySelf: "end" }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: tint(12),
              color: "primary.main",
              border: 2,
              borderColor: tint(45),
              fontWeight: 600,
            }}
          >
            K
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
