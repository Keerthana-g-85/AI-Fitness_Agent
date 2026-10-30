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
@Entity("fitness_goals")
@Index("IDX_fitness_goals_user_id", ["userId"])
export default class FitnessGoal {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.fitnessGoals, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "primary_goal", type: "varchar", length: 80, nullable: false })
  primaryGoal!: string;

  @Column({ name: "secondary_goal", type: "varchar", length: 80, nullable: true })
  secondaryGoal?: string | null;

  @Column({ name: "current_weight_kg", type: "numeric", precision: 6, scale: 2, nullable: false })
  currentWeightKg!: string;

  @Column({ name: "target_weight_kg", type: "numeric", precision: 6, scale: 2, nullable: true })
  targetWeightKg?: string | null;

  @Column({ name: "target_body_fat_percentage", type: "numeric", precision: 5, scale: 2, nullable: true })
  targetBodyFatPercentage?: string | null;

  @Column({ name: "target_muscle_mass_kg", type: "numeric", precision: 6, scale: 2, nullable: true })
  targetMuscleMassKg?: string | null;

  @Column({ name: "target_date", type: "date", nullable: true })
  targetDate?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
