import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";

interface IngredientCardProps {
  ingredients: string;
}

export default function IngredientCard({ ingredients }: IngredientCardProps) {
  const items = ingredients
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Ingredients
        </Typography>
        <List dense disablePadding>
          {items.map((item, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
