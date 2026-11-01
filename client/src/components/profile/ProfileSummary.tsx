import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

export interface SummaryField {
  label: string;
  value: ReactNode;
  wide?: boolean;
}

interface ProfileSummaryProps {
  fields: SummaryField[];
}

export const ProfileSummary = ({ fields }: ProfileSummaryProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        lg: "repeat(3, minmax(0, 1fr))",
      },
      gap: 2,
    }}
  >
    {fields.map((field) => (
      <Box
        key={field.label}
        sx={{ gridColumn: field.wide ? { sm: "1 / -1" } : undefined, minWidth: 0 }}
      >
        <Typography color="text.secondary" variant="caption">
          {field.label}
        </Typography>
        <Typography sx={{ mt: 0.25, overflowWrap: "anywhere", fontWeight: 600 }} variant="body2">
          {field.value}
        </Typography>
      </Box>
    ))}
  </Box>
);
