import { Resolver, Ctx, Arg, Int, Mutation, Query } from "type-graphql";
import { Context } from "apollo-server-express";
import { User } from "../entities/User";
import { dataSource } from "../data-source";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await dataSource.getRepository(User).find();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id") id: string): Promise<User | null> {
    return await dataSource.getRepository(User).findOneBy({ id });
  }

  @Mutation(() => User)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: Context
  ): Promise<User> {
    const repo = dataSource.getRepository(User);
    const existingUser = await repo.findOneBy({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const user = repo.create({ id: require("crypto").randomUUID(), name, email, password });
    return await repo.save(user);
  }
}