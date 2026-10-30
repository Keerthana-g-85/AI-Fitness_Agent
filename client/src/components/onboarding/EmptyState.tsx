import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) => (
  <Box
    sx={{
      border: "1px dashed",
      borderColor: "rgba(15, 118, 110, 0.3)",
      borderRadius: 3,
      p: { xs: 2.5, sm: 4 },
      textAlign: "center",
      backgroundColor: "rgba(243, 247, 246, 0.5)",
    }}
  >
    <Stack spacing={1.5} sx={{ alignItems: "center" }}>
      {icon}
      <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
        {title}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {description}
      </Typography>
      <Button onClick={onAction} startIcon={<AddIcon />} variant="outlined">
        {actionLabel}
      </Button>
    </Stack>
  </Box>
);
