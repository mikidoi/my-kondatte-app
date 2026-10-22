import { Outlet, useMatch, useSearchParams } from "react-router";
import { Box, Container } from "@mui/material";
import Header from "./Header";
import SubNavBar from "../shared/components/SubNavBar";

export default function Layout() {
  const isRecipeDetail = useMatch("/recipes/:id");
  const [, setSearchParams] = useSearchParams();

  const handleEdit = () => setSearchParams({ edit: "true" });

  return (
    <Box>
      {isRecipeDetail ? (
        <SubNavBar backTo="/recipes" onEdit={handleEdit} />
      ) : (
        <Header />
      )}
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
