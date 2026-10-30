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
@Entity("workout_schedules")
@Index("IDX_workout_schedules_user_id", ["userId"], { unique: true })
export default class WorkoutSchedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @OneToOne(() => User, (user) => user.workoutSchedule, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "workout_days_per_week", type: "integer", nullable: false })
  workoutDaysPerWeek!: number;

  @Column({ name: "workout_duration", type: "varchar", length: 40, nullable: false })
  workoutDuration!: string;

  @Column({ name: "preferred_workout_time", type: "varchar", length: 30, nullable: false })
  preferredWorkoutTime!: string;

  @Column({ name: "rest_days", type: "jsonb", nullable: false, default: () => "'[]'" })
  restDays: string[] = [];

  @Column({ name: "preferred_intensity", type: "varchar", length: 30, nullable: false })
  preferredIntensity!: string;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
