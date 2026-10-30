import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface EntryCardProps {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}

export const EntryCard = ({ title, onRemove, children }: EntryCardProps) => (
  <Card
    elevation={0}
    variant="outlined"
    sx={{
      borderRadius: 3,
      borderColor: "rgba(15, 118, 110, 0.16)",
      backgroundColor: "#ffffff",
    }}
  >
    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
            {title}
          </Typography>
          <Button
            color="error"
            onClick={onRemove}
            size="small"
            startIcon={<DeleteForeverOutlinedIcon />}
          >
            Remove
          </Button>
        </Stack>
        {children}
      </Stack>
    </CardContent>
  </Card>
);
