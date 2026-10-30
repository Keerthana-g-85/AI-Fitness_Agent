import { Arg, Mutation, Query, Resolver } from "type-graphql";
import CreateUserArguments from "../Arguments/UserArguments/CreateUser";
import UserResponse from "../Response/UserResponse";
import UserService from "../Service/UserService";

@Resolver()
export default class UserResolver {
  private readonly userService = new UserService();

  @Query(() => String)
  health(): string {
    return "ok";
  }

  @Mutation(() => UserResponse)
  async createUser(
    @Arg("input", () => CreateUserArguments) input: CreateUserArguments,
  ): Promise<UserResponse> {
    return this.userService.createUser(input);
  }
}
