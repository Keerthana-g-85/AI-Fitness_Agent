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
@Entity("medications")
@Index("IDX_medications_user_id", ["userId"])
export default class Medication {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.medications, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "medicine_name", type: "varchar", length: 200, nullable: false })
  medicineName!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  dosage?: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  frequency?: string | null;

  @Column({ name: "start_date", type: "date", nullable: true })
  startDate?: string | null;

  @Column({ name: "end_date", type: "date", nullable: true })
  endDate?: string | null;

  @Column({ name: "reason_for_taking", type: "text", nullable: true })
  reasonForTaking?: string | null;

  @Column({ name: "doctor_prescribed", type: "boolean", nullable: false, default: false })
  doctorPrescribed = false;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
