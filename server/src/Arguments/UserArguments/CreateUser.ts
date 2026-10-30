import { Field, InputType } from "type-graphql";

@InputType()
export default class CreateUserArguments {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}
