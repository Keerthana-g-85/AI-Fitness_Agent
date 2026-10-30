import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class UserResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}
