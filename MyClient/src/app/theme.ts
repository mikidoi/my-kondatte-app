import { createTheme } from "@mui/material";

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#6b7a3a", contrastText: "#ffffff" },
        background: { default: "#f6f6f0", paper: "#fdfdfb" },
        text: { primary: "#1f1f1a", secondary: "#8a8a78" },
        divider: "#e3e5d3",
        secondary: { main: "#ef6c00" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#66bb6a" },
        secondary: { main: "#ffa726" },
        background: { default: "#121212", paper: "#1e1e1e" },
      },
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
