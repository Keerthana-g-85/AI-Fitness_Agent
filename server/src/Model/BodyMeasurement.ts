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
@Entity("body_measurements")
@Index("IDX_body_measurements_user_id", ["userId"])
export default class BodyMeasurement {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.bodyMeasurements, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "weight_kg", type: "numeric", precision: 6, scale: 2, nullable: true })
  weightKg?: string | null;

  @Column({ name: "neck_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  neckCm?: string | null;

  @Column({ name: "shoulder_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  shoulderCm?: string | null;

  @Column({ name: "chest_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  chestCm?: string | null;

  @Column({ name: "bust_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  bustCm?: string | null;

  @Column({ name: "waist_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  waistCm?: string | null;

  @Column({ name: "abdomen_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  abdomenCm?: string | null;

  @Column({ name: "hip_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  hipCm?: string | null;

  @Column({ name: "left_arm_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  leftArmCm?: string | null;

  @Column({ name: "right_arm_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  rightArmCm?: string | null;

  @Column({ name: "left_thigh_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  leftThighCm?: string | null;

  @Column({ name: "right_thigh_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  rightThighCm?: string | null;

  @Column({ name: "left_calf_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  leftCalfCm?: string | null;

  @Column({ name: "right_calf_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  rightCalfCm?: string | null;

  @Column({ name: "height_cm", type: "numeric", precision: 5, scale: 2, nullable: true })
  heightCm?: string | null;

  @Column({ type: "varchar", length: 80, nullable: true })
  source?: string | null;

  @Column({ name: "measured_at", type: "date", nullable: true })
  measuredAt?: string | null;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
