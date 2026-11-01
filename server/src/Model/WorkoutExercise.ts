import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import WorkoutSession from "./WorkoutSession";

@ObjectType()
@Entity("workout_exercises")
@Index("IDX_workout_exercises_session_id", ["workoutSessionId"])
export default class WorkoutExercise {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "workout_session_id", type: "uuid", nullable: false })
  workoutSessionId!: string;

  @ManyToOne(() => WorkoutSession, (session) => session.exercises, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "workout_session_id" })
  session!: WorkoutSession;

  @Column({ name: "exercise_name", type: "varchar", length: 150, nullable: false })
  exerciseName!: string;

  @Column({ type: "integer", nullable: true })
  sets?: number | null;

  @Column({ type: "integer", nullable: true })
  reps?: number | null;

  @Column({ name: "weight_kg", type: "numeric", precision: 6, scale: 2, nullable: true })
  weightKg?: string | null;

  @Column({ name: "duration_minutes", type: "integer", nullable: true })
  durationMinutes?: number | null;

  @Column({ name: "distance_km", type: "numeric", precision: 7, scale: 2, nullable: true })
  distanceKm?: string | null;

  @Column({ name: "calories_burned", type: "integer", nullable: true })
  caloriesBurned?: number | null;

  @Column({ name: "order_index", type: "integer", nullable: false, default: 0 })
  orderIndex = 0;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
