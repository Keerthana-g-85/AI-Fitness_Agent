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
@Entity("body_compositions")
@Index("IDX_body_compositions_user_id", ["userId"])
export default class BodyComposition {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.bodyCompositions, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "body_fat_percentage", type: "numeric", precision: 5, scale: 2, nullable: true })
  bodyFatPercentage?: string | null;

  @Column({ name: "fat_mass_kg", type: "numeric", precision: 6, scale: 2, nullable: true })
  fatMassKg?: string | null;

  @Column({ name: "muscle_mass_kg", type: "numeric", precision: 6, scale: 2, nullable: true })
  muscleMassKg?: string | null;

  @Column({ name: "skeletal_muscle_mass_kg", type: "numeric", precision: 6, scale: 2, nullable: true })
  skeletalMuscleMassKg?: string | null;

  @Column({ name: "lean_body_mass_kg", type: "numeric", precision: 6, scale: 2, nullable: true })
  leanBodyMassKg?: string | null;

  @Column({ name: "body_water_percentage", type: "numeric", precision: 5, scale: 2, nullable: true })
  bodyWaterPercentage?: string | null;

  @Column({ name: "total_body_water_liters", type: "numeric", precision: 6, scale: 2, nullable: true })
  totalBodyWaterLiters?: string | null;

  @Column({ name: "visceral_fat", type: "integer", nullable: true })
  visceralFat?: number | null;

  @Column({ name: "bone_mass_kg", type: "numeric", precision: 5, scale: 2, nullable: true })
  boneMassKg?: string | null;

  @Column({ name: "protein_percentage", type: "numeric", precision: 5, scale: 2, nullable: true })
  proteinPercentage?: string | null;

  @Column({ name: "bmr_kcal", type: "integer", nullable: true })
  bmrKcal?: number | null;

  @Column({ name: "bmi", type: "numeric", precision: 5, scale: 2, nullable: true })
  bmi?: string | null;

  @Column({ name: "metabolic_age", type: "integer", nullable: true })
  metabolicAge?: number | null;

  @Column({ type: "varchar", length: 80, nullable: true })
  source?: string | null;

  @Column({ name: "measured_at", type: "date", nullable: true })
  measuredAt?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
