import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface InstructionCardProps {
  instructions: string;
}

export default function InstructionCard({
  instructions,
}: InstructionCardProps) {
  const steps = instructions
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Instructions
        </Typography>
        <List>
          {steps.map((step, index) => (
            <ListItem key={index} disableGutters alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography variant="body2">
                    <Typography component="span" sx={{ fontWeight: 700, mr: 1 }}>
                      {index + 1}.
                    </Typography>
                    {step}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
