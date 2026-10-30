import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const SectionCard = ({
  title,
  description,
  action,
  children,
}: SectionCardProps) => (
  <Card
    elevation={0}
    variant="outlined"
    sx={{
      borderRadius: 3,
      borderColor: "rgba(15, 118, 110, 0.14)",
      backgroundColor: "rgba(243, 247, 246, 0.45)",
    }}
  >
    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={0.5}>
            <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
              {title}
            </Typography>
            {description && (
              <Typography color="text.secondary" variant="body2">
                {description}
              </Typography>
            )}
          </Stack>
          {action}
        </Stack>
        {children}
      </Stack>
    </CardContent>
  </Card>
);
