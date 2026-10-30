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
@Entity("exercise_restrictions")
@Index("IDX_exercise_restrictions_user_id", ["userId"], { unique: true })
export default class ExerciseRestriction {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @OneToOne(() => User, (user) => user.exerciseRestrictions, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "current_injuries", type: "text", nullable: true })
  currentInjuries?: string | null;

  @Column({ name: "experiences_joint_pain", type: "boolean", nullable: false, default: false })
  experiencesJointPain = false;

  @Column({ name: "restricted_exercises", type: "text", nullable: true })
  restrictedExercises?: string | null;

  @Column({ name: "disliked_exercises", type: "text", nullable: true })
  dislikedExercises?: string | null;

  @Column({ name: "doctor_exercise_restrictions", type: "text", nullable: true })
  doctorExerciseRestrictions?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
