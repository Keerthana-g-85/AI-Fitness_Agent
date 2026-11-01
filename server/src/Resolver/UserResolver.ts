import type { Response } from "express";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import CreateUserArguments from "../Arguments/UserArguments/CreateUser";
import LoginArguments from "../Arguments/UserArguments/Login";
import LoginResponse, { LogoutResponse } from "../Response/LoginResponse";
import UserResponse from "../Response/UserResponse";
import UserService from "../Service/UserService";
import { clearAuthCookie, setAuthCookie } from "../auth";

interface UserContext {
  userId?: string | null;
  res: Response;
}

@Resolver()
export default class UserResolver {
  private readonly userService = new UserService();

  @Query(() => String)
  health(): string {
    return "ok";
  }

  @Mutation(() => LoginResponse)
  async loginUser(
    @Arg("input", () => LoginArguments) input: LoginArguments,
    @Ctx() context: UserContext,
  ): Promise<LoginResponse> {
    const response = await this.userService.loginUser(input);

    if (response.success && response.token) {
      setAuthCookie(context.res, response.token, input.rememberMe);
    }

    return response;
  }

  @Mutation(() => LogoutResponse)
  logoutUser(@Ctx() context: UserContext): LogoutResponse {
    clearAuthCookie(context.res);

    return { success: true, message: "Logged out successfully" };
  }

  @Mutation(() => UserResponse)
  async createUser(
    @Arg("input", () => CreateUserArguments) input: CreateUserArguments,
    @Ctx() context: UserContext,
  ): Promise<UserResponse> {
    const response = await this.userService.createUser(input);

    if (response.success && response.token) {
      setAuthCookie(context.res, response.token);
    }

    return response;
  }
}
