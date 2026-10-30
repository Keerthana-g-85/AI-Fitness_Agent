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
@Entity("food_preferences")
@Index("IDX_food_preferences_user_id", ["userId"], { unique: true })
export default class FoodPreference {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @OneToOne(() => User, (user) => user.foodPreferences, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "diet_type", type: "varchar", length: 50, nullable: false })
  dietType!: string;

  @Column({ name: "preferred_cuisine", type: "jsonb", nullable: false, default: () => "'[]'" })
  preferredCuisine: string[] = [];

  @Column({ name: "food_allergies", type: "jsonb", nullable: false, default: () => "'[]'" })
  foodAllergies: string[] = [];

  @Column({ name: "other_food_allergy", type: "text", nullable: true })
  otherFoodAllergy?: string | null;

  @Column({ name: "food_intolerances", type: "jsonb", nullable: false, default: () => "'[]'" })
  foodIntolerances: string[] = [];

  @Column({ name: "other_food_intolerance", type: "text", nullable: true })
  otherFoodIntolerance?: string | null;

  @Column({ name: "disliked_foods", type: "jsonb", nullable: false, default: () => "'[]'" })
  dislikedFoods: string[] = [];

  @Column({ name: "favourite_foods", type: "jsonb", nullable: false, default: () => "'[]'" })
  favouriteFoods: string[] = [];

  @Column({ name: "daily_food_budget", type: "numeric", precision: 10, scale: 2, nullable: true })
  dailyFoodBudget?: string | null;

  @Column({ name: "cooking_preference", type: "varchar", length: 30, nullable: false })
  cookingPreference!: string;

  @Column({ name: "cooking_time", type: "integer", nullable: true })
  cookingTime?: number | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
