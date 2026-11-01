import { Field, Float, InputType, Int } from "type-graphql";

@InputType()
export class FoodIntakeInput {
  @Field(() => String)
  foodName!: string;

  @Field(() => String)
  mealType!: string;

  @Field(() => String, { nullable: true })
  servingSize?: string | null;

  @Field(() => Float)
  calories!: number;

  @Field(() => Float, { nullable: true })
  proteinG?: number | null;

  @Field(() => Float, { nullable: true })
  carbsG?: number | null;

  @Field(() => Float, { nullable: true })
  fatG?: number | null;

  @Field(() => Float, { nullable: true })
  fiberG?: number | null;

  @Field(() => String)
  consumedOn!: string;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class UpdateFoodIntakeInput {
  @Field(() => String, { nullable: true })
  foodName?: string | null;

  @Field(() => String, { nullable: true })
  mealType?: string | null;

  @Field(() => String, { nullable: true })
  servingSize?: string | null;

  @Field(() => Float, { nullable: true })
  calories?: number | null;

  @Field(() => Float, { nullable: true })
  proteinG?: number | null;

  @Field(() => Float, { nullable: true })
  carbsG?: number | null;

  @Field(() => Float, { nullable: true })
  fatG?: number | null;

  @Field(() => Float, { nullable: true })
  fiberG?: number | null;

  @Field(() => String, { nullable: true })
  consumedOn?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class WaterIntakeInput {
  @Field(() => Int)
  amountMl!: number;

  @Field(() => String)
  consumedOn!: string;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class UpdateWaterIntakeInput {
  @Field(() => Int, { nullable: true })
  amountMl?: number | null;

  @Field(() => String, { nullable: true })
  consumedOn?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class WorkoutExerciseInput {
  @Field(() => String)
  exerciseName!: string;

  @Field(() => Int, { nullable: true })
  sets?: number | null;

  @Field(() => Int, { nullable: true })
  reps?: number | null;

  @Field(() => Float, { nullable: true })
  weightKg?: number | null;

  @Field(() => Int, { nullable: true })
  durationMinutes?: number | null;

  @Field(() => Float, { nullable: true })
  distanceKm?: number | null;

  @Field(() => Int, { nullable: true })
  caloriesBurned?: number | null;
}

@InputType()
export class WorkoutSessionInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  workoutType!: string;

  @Field(() => String)
  performedOn!: string;

  @Field(() => Int)
  durationMinutes!: number;

  @Field(() => Int, { nullable: true })
  caloriesBurned?: number | null;

  @Field(() => String, { nullable: true })
  intensity?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => [WorkoutExerciseInput], { nullable: true })
  exercises?: WorkoutExerciseInput[] | null;
}

@InputType()
export class UpdateWorkoutSessionInput {
  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  workoutType?: string | null;

  @Field(() => String, { nullable: true })
  performedOn?: string | null;

  @Field(() => Int, { nullable: true })
  durationMinutes?: number | null;

  @Field(() => Int, { nullable: true })
  caloriesBurned?: number | null;

  @Field(() => String, { nullable: true })
  intensity?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => [WorkoutExerciseInput], { nullable: true })
  exercises?: WorkoutExerciseInput[] | null;
}

@InputType()
export class SleepRecordInput {
  @Field(() => String)
  sleepDate!: string;

  @Field(() => String, { nullable: true })
  bedTime?: string | null;

  @Field(() => String, { nullable: true })
  wakeTime?: string | null;

  @Field(() => Int)
  durationMinutes!: number;

  @Field(() => String, { nullable: true })
  quality?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class UpdateSleepRecordInput {
  @Field(() => String, { nullable: true })
  sleepDate?: string | null;

  @Field(() => String, { nullable: true })
  bedTime?: string | null;

  @Field(() => String, { nullable: true })
  wakeTime?: string | null;

  @Field(() => Int, { nullable: true })
  durationMinutes?: number | null;

  @Field(() => String, { nullable: true })
  quality?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class SportsActivityInput {
  @Field(() => String)
  sportName!: string;

  @Field(() => String)
  activityDate!: string;

  @Field(() => Int)
  durationMinutes!: number;

  @Field(() => String, { nullable: true })
  intensity?: string | null;

  @Field(() => Int, { nullable: true })
  caloriesBurned?: number | null;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class UpdateSportsActivityInput {
  @Field(() => String, { nullable: true })
  sportName?: string | null;

  @Field(() => String, { nullable: true })
  activityDate?: string | null;

  @Field(() => Int, { nullable: true })
  durationMinutes?: number | null;

  @Field(() => String, { nullable: true })
  intensity?: string | null;

  @Field(() => Int, { nullable: true })
  caloriesBurned?: number | null;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}
