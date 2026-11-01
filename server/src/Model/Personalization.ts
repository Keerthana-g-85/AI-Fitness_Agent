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
@Entity("personalization")
@Index("IDX_personalization_user_id", ["userId"], { unique: true })
export default class Personalization {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @OneToOne(() => User, (user) => user.personalization, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "reminder_preference", type: "boolean", nullable: false, default: false })
  reminderPreference = false;

  @Column({ name: "water_reminder", type: "boolean", nullable: false, default: false })
  waterReminder = false;

  @Column({ name: "meal_reminder", type: "boolean", nullable: false, default: false })
  mealReminder = false;

  @Column({ name: "workout_reminder", type: "boolean", nullable: false, default: false })
  workoutReminder = false;

  @Column({ name: "preferred_language", type: "varchar", length: 50, nullable: false })
  preferredLanguage!: string;

  @Column({ name: "coaching_style", type: "varchar", length: 50, nullable: false })
  coachingStyle!: string;

  @Column({ name: "notification_frequency", type: "varchar", length: 30, nullable: false })
  notificationFrequency!: string;

  @Column({ name: "daily_water_target_ml", type: "integer", nullable: true })
  dailyWaterTargetMl?: number | null;

  @Column({ name: "sleep_goal_minutes", type: "integer", nullable: true })
  sleepGoalMinutes?: number | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
