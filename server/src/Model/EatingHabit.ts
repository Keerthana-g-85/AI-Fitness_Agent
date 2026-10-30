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
@Entity("eating_habits")
@Index("IDX_eating_habits_user_id", ["userId"], { unique: true })
export default class EatingHabit {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @OneToOne(() => User, (user) => user.eatingHabits, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "meals_per_day", type: "varchar", length: 30, nullable: false })
  mealsPerDay!: string;

  @Column({ name: "breakfast_time", type: "time", nullable: true })
  breakfastTime?: string | null;

  @Column({ name: "lunch_time", type: "time", nullable: true })
  lunchTime?: string | null;

  @Column({ name: "dinner_time", type: "time", nullable: true })
  dinnerTime?: string | null;

  @Column({ name: "eats_snacks", type: "boolean", nullable: false, default: false })
  eatsSnacks = false;

  @Column({ name: "frequently_eats_outside", type: "boolean", nullable: false, default: false })
  frequentlyEatsOutside = false;

  @Column({ name: "prefers_homemade_food", type: "boolean", nullable: false, default: false })
  prefersHomemadeFood = false;

  @Column({ name: "follows_intermittent_fasting", type: "boolean", nullable: false, default: false })
  followsIntermittentFasting = false;

  @Column({ name: "fasting_window", type: "varchar", length: 20, nullable: true })
  fastingWindow?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
