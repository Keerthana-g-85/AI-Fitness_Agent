import type { ReactNode } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

interface ProfileSectionProps {
  id?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  onEdit: () => void;
  editLabel: string;
  children: ReactNode;
}

export const ProfileSection = ({
  id,
  title,
  description,
  icon,
  onEdit,
  editLabel,
  children,
}: ProfileSectionProps) => (
  <Paper
    component="section"
    elevation={0}
    id={id}
    sx={{
      p: { xs: 2.5, sm: 3 },
      borderRadius: 3,
      border: "1px solid",
      borderColor: "rgba(15, 118, 110, 0.14)",
      backgroundColor: "#ffffff",
      scrollMarginTop: 96,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        mb: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
        {icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(15, 118, 110, 0.08)",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800 }} variant="h6">
            {title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        </Box>
      </Box>
      <Button
        aria-label={editLabel}
        onClick={onEdit}
        size="small"
        startIcon={<EditOutlinedIcon />}
        sx={{ flexShrink: 0 }}
      >
        Edit
      </Button>
    </Box>
    {children}
  </Paper>
);
