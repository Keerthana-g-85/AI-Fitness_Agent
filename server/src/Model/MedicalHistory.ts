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
@Entity("medical_histories")
@Index("IDX_medical_histories_user_id", ["userId"])
export default class MedicalHistory {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.medicalHistories, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "condition_name", type: "varchar", length: 200, nullable: false })
  conditionName!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ name: "is_active", type: "boolean", nullable: false, default: true })
  isActive = true;

  @Column({ name: "doctor_advice", type: "text", nullable: true })
  doctorAdvice?: string | null;

  @Column({ name: "treatment_details", type: "text", nullable: true })
  treatmentDetails?: string | null;

  @Column({ name: "diagnosis_date", type: "date", nullable: true })
  diagnosisDate?: string | null;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
