import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class AuthUserResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => Boolean)
  onboardingCompleted!: boolean;

  @Field(() => Date, { nullable: true })
  onboardingCompletedAt?: Date | null;
}

@ObjectType()
export default class LoginResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;

  @Field(() => String, { nullable: true })
  token?: string | null;

  @Field(() => AuthUserResponse, { nullable: true })
  user?: AuthUserResponse | null;
}

@ObjectType()
export class LogoutResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}
