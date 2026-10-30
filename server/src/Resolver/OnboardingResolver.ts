import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import CompleteOnboardingInput from "../Arguments/OnboardingArguments/CompleteOnboarding";
import OnboardingResponse from "../Response/OnboardingResponse";
import OnboardingService from "../Service/OnboardingService";

interface OnboardingContext {
  userId?: string | null;
}

@Resolver()
export default class OnboardingResolver {
  private readonly onboardingService = new OnboardingService();

  @Mutation(() => OnboardingResponse)
  async completeOnboarding(
    @Arg("input", () => CompleteOnboardingInput) input: CompleteOnboardingInput,
    @Ctx() context: OnboardingContext,
  ): Promise<OnboardingResponse> {
    return this.onboardingService.completeOnboarding(context.userId, input);
  }
}
