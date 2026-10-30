import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class OnboardingResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}
