import { Field, Float, InputType } from "type-graphql";

@InputType()
export class BodyCompositionRecordInput {
  @Field(() => Float, { nullable: true })
  bodyFatPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  fatMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  muscleMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  skeletalMuscleMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  leanBodyMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  bodyWaterPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  totalBodyWaterLiters?: number | null;

  @Field(() => Float, { nullable: true })
  visceralFat?: number | null;

  @Field(() => Float, { nullable: true })
  boneMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  proteinPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  bmrKcal?: number | null;

  @Field(() => Float, { nullable: true })
  bmi?: number | null;

  @Field(() => Float, { nullable: true })
  metabolicAge?: number | null;

  @Field(() => String, { nullable: true })
  source?: string | null;
}

@InputType()
export class AddBodyMeasurementInput {
  @Field(() => String)
  measuredAt!: string;

  @Field(() => Float, { nullable: true })
  heightCm?: number | null;

  @Field(() => Float, { nullable: true })
  weightKg?: number | null;

  @Field(() => Float, { nullable: true })
  neckCm?: number | null;

  @Field(() => Float, { nullable: true })
  shoulderCm?: number | null;

  @Field(() => Float, { nullable: true })
  chestCm?: number | null;

  @Field(() => Float, { nullable: true })
  bustCm?: number | null;

  @Field(() => Float, { nullable: true })
  waistCm?: number | null;

  @Field(() => Float, { nullable: true })
  abdomenCm?: number | null;

  @Field(() => Float, { nullable: true })
  hipCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftCalfCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightCalfCm?: number | null;

  @Field(() => String, { nullable: true })
  source?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => BodyCompositionRecordInput, { nullable: true })
  composition?: BodyCompositionRecordInput | null;
}

@InputType()
export class UpdateBodyMeasurementRecordInput {
  @Field(() => String, { nullable: true })
  measuredAt?: string | null;

  @Field(() => Float, { nullable: true })
  heightCm?: number | null;

  @Field(() => Float, { nullable: true })
  weightKg?: number | null;

  @Field(() => Float, { nullable: true })
  neckCm?: number | null;

  @Field(() => Float, { nullable: true })
  shoulderCm?: number | null;

  @Field(() => Float, { nullable: true })
  chestCm?: number | null;

  @Field(() => Float, { nullable: true })
  bustCm?: number | null;

  @Field(() => Float, { nullable: true })
  waistCm?: number | null;

  @Field(() => Float, { nullable: true })
  abdomenCm?: number | null;

  @Field(() => Float, { nullable: true })
  hipCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftCalfCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightCalfCm?: number | null;

  @Field(() => String, { nullable: true })
  source?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => BodyCompositionRecordInput, { nullable: true })
  composition?: BodyCompositionRecordInput | null;
}
