import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { useAuth } from "../context/AuthContext";

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="sticky"
      sx={{
        borderBottom: "1px solid",
        borderColor: "rgba(15, 118, 110, 0.12)",
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: "center", flexGrow: 1, minWidth: 0 }}
        >
          <Box
            component={RouterLink}
            to="/dashboard"
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 19,
              textDecoration: "none",
              background: "linear-gradient(135deg, #0f766e, #14b8a6)",
              boxShadow: "0 8px 20px rgba(15, 118, 110, 0.25)",
              flexShrink: 0,
            }}
          >
            F
          </Box>
          <Typography
            component={RouterLink}
            to="/dashboard"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: "-0.02em",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
            variant="subtitle1"
          >
            AI Fitness Agent
          </Typography>
        </Stack>

        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} sx={{ alignItems: "center" }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              display: { xs: "none", sm: "flex" },
              bgcolor: "primary.main",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {user ? getInitials(user.name) : "U"}
          </Avatar>
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            variant="body2"
          >
            {user?.name}
          </Typography>
          <Button
            component={RouterLink}
            size="small"
            startIcon={<DashboardOutlinedIcon />}
            to="/dashboard"
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            size="small"
            startIcon={<EventNoteOutlinedIcon />}
            to="/tracking"
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Tracking
            </Box>
          </Button>
          <Button
            component={RouterLink}
            size="small"
            startIcon={<PersonOutlineOutlinedIcon />}
            to="/profile"
          >
            Profile
          </Button>
          <Button
            color="inherit"
            disabled={isLoggingOut}
            onClick={handleLogout}
            size="small"
            startIcon={
              isLoggingOut ? (
                <CircularProgress color="inherit" size={16} />
              ) : (
                <LogoutOutlinedIcon />
              )
            }
            sx={{ color: "text.secondary" }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Logout
            </Box>
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
