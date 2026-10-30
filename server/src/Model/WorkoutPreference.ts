import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
@Entity("workout_preferences")
@Index("IDX_workout_preferences_user_id", ["userId"], { unique: true })
export default class WorkoutPreference {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @OneToOne(() => User, (user) => user.workoutPreferences, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "fitness_level", type: "varchar", length: 30, nullable: false })
  fitnessLevel!: string;

  @Column({ name: "workout_experience", type: "varchar", length: 50, nullable: false })
  workoutExperience!: string;

  @Column({ name: "workout_location", type: "varchar", length: 50, nullable: false })
  workoutLocation!: string;

  @Column({ name: "gym_membership", type: "boolean", nullable: false, default: false })
  gymMembership = false;

  @Column({ name: "available_equipment", type: "jsonb", nullable: false, default: () => "'[]'" })
  availableEquipment: string[] = [];

  @Column({ name: "other_equipment", type: "text", nullable: true })
  otherEquipment?: string | null;

  @Column({ name: "preferred_workouts", type: "jsonb", nullable: false, default: () => "'[]'" })
  preferredWorkouts: string[] = [];

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
