import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
@Entity("food_intakes")
@Index("IDX_food_intakes_user_date", ["userId", "consumedOn"])
export default class FoodIntake {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.foodIntakes, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "food_name", type: "varchar", length: 200, nullable: false })
  foodName!: string;

  @Column({ name: "meal_type", type: "varchar", length: 30, nullable: false })
  mealType!: string;

  @Column({ name: "serving_size", type: "varchar", length: 100, nullable: true })
  servingSize?: string | null;

  @Column({ name: "calories", type: "numeric", precision: 7, scale: 2, nullable: false })
  calories!: string;

  @Column({ name: "protein_g", type: "numeric", precision: 7, scale: 2, nullable: true })
  proteinG?: string | null;

  @Column({ name: "carbs_g", type: "numeric", precision: 7, scale: 2, nullable: true })
  carbsG?: string | null;

  @Column({ name: "fat_g", type: "numeric", precision: 7, scale: 2, nullable: true })
  fatG?: string | null;

  @Column({ name: "fiber_g", type: "numeric", precision: 7, scale: 2, nullable: true })
  fiberG?: string | null;

  @Column({ name: "consumed_on", type: "date", nullable: false })
  consumedOn!: string;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
