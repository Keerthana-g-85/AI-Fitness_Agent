import { Field, InputType } from "type-graphql";

@InputType()
export default class LoginArguments {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

  @Field(() => Boolean, { defaultValue: false })
  rememberMe = false;
}
