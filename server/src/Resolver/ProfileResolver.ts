import { Ctx, Query, Resolver } from "type-graphql";
import { GraphQLError } from "graphql";
import type ProfileResponse from "../Response/ProfileResponse";
import ProfileResponseType, {
  DashboardResponse,
  UpdateProfileResponse,
} from "../Response/ProfileResponse";
import ProfileService from "../Service/ProfileService";
import UpdateMyProfileInput from "../Arguments/ProfileArguments/UpdateMyProfile";
import { Arg, Mutation } from "type-graphql";

interface ProfileContext {
  userId?: string | null;
}

const requireAuthentication = (userId?: string | null): string => {
  if (!userId) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return userId;
};

@Resolver()
export default class ProfileResolver {
  private readonly profileService = new ProfileService();

  @Query(() => ProfileResponseType)
  async getMyProfile(
    @Ctx() context: ProfileContext,
  ): Promise<ProfileResponse> {
    const userId = requireAuthentication(context.userId);
    const profile = await this.profileService.getMyProfile(userId);

    if (!profile) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    return profile;
  }

  @Query(() => DashboardResponse)
  async getDashboard(@Ctx() context: ProfileContext): Promise<DashboardResponse> {
    const userId = requireAuthentication(context.userId);
    const dashboard = await this.profileService.getDashboard(userId);

    if (!dashboard) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    return dashboard;
  }

  @Mutation(() => UpdateProfileResponse)
  async updateMyProfile(
    @Arg("input", () => UpdateMyProfileInput) input: UpdateMyProfileInput,
    @Ctx() context: ProfileContext,
  ): Promise<UpdateProfileResponse> {
    const userId = requireAuthentication(context.userId);

    return this.profileService.updateMyProfile(userId, input);
  }
}
