import { ClientError } from "graphql-request";
import { graphqlClient } from "./graphqlClient";
import { GET_MY_PROFILE } from "../graphql/Query/GET_MY_PROFILE";
import { GET_DASHBOARD } from "../graphql/Query/GET_DASHBOARD";
import { UPDATE_MY_PROFILE } from "../graphql/Mutation/UPDATE_MY_PROFILE";
import type {
  DashboardProfile,
  MyProfile,
  UpdateMyProfileInput,
  UpdateProfileResponse,
} from "../types/profile";

export const profileQueryKeys = {
  me: ["my-profile"] as const,
  dashboard: ["dashboard"] as const,
};

interface MyProfileQueryData {
  getMyProfile: MyProfile;
}

interface DashboardQueryData {
  getDashboard: DashboardProfile;
}

interface UpdateMyProfileMutationData {
  updateMyProfile: UpdateProfileResponse;
}

export const getMyProfile = async (): Promise<MyProfile> => {
  const data = await graphqlClient.request<MyProfileQueryData>(GET_MY_PROFILE);

  return data.getMyProfile;
};

export const getDashboard = async (): Promise<DashboardProfile> => {
  const data = await graphqlClient.request<DashboardQueryData>(GET_DASHBOARD);

  return data.getDashboard;
};

export const updateMyProfile = async (
  input: UpdateMyProfileInput,
): Promise<UpdateProfileResponse> => {
  const data = await graphqlClient.request<
    UpdateMyProfileMutationData,
    { input: UpdateMyProfileInput }
  >(UPDATE_MY_PROFILE, { input });

  return data.updateMyProfile;
};

export const getProfileErrorMessage = (error: unknown): string => {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? "Unable to load your profile";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
