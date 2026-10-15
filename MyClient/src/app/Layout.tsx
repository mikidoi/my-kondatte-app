import { Outlet } from "react-router";
import { Box, Container } from "@mui/material";
import Header from "./Header";

export default function Layout() {
  return (
    <Box>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
