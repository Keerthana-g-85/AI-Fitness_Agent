import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppHeader } from "../../components/AppHeader";
import { ProfileSectionEditor } from "../../components/profile/EditProfileDialog";
import {
  getMyProfile,
  getProfileErrorMessage,
  profileQueryKeys,
} from "../../api/profileApi";
import type { EditableSection } from "../../types/profile";

interface ProfileEditPageProps {
  section: EditableSection;
}

const ProfileEditPage = ({ section }: ProfileEditPageProps) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: profileQueryKeys.me,
    queryFn: getMyProfile,
    retry: false,
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        <Button
          color="inherit"
          onClick={() => navigate("/profile")}
          startIcon={<ArrowBackIcon />}
          sx={{ color: "text.secondary", mb: 2 }}
        >
          Back to profile
        </Button>

        {isLoading && (
          <Stack spacing={2} sx={{ alignItems: "center", py: 8 }}>
            <CircularProgress />
            <Typography color="text.secondary" variant="body2">
              Loading your profile...
            </Typography>
          </Stack>
        )}

        {isError && (
          <Alert
            action={
              <Button color="inherit" onClick={() => void refetch()} size="small">
                Retry
              </Button>
            }
            severity="error"
          >
            {getProfileErrorMessage(error)}
          </Alert>
        )}

        {data && (
          <ProfileSectionEditor
            onClose={() => navigate("/profile")}
            onSaved={(message) =>
              navigate("/profile", { replace: true, state: { message } })
            }
            open
            profile={data}
            section={section}
            variant="page"
          />
        )}
      </Container>
    </Box>
  );
};

export default ProfileEditPage;
