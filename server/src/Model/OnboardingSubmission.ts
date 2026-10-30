import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
@Entity("onboarding_submissions")
@Unique("UQ_onboarding_submissions_user_submission", ["userId", "submissionId"])
@Index("IDX_onboarding_submissions_user_id", ["userId"])
@Index("IDX_onboarding_submissions_submission_id", ["submissionId"])
export default class OnboardingSubmission {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @Column({ name: "submission_id", type: "uuid", nullable: false })
  submissionId!: string;

  @ManyToOne(() => User, (user) => user.onboardingSubmissions, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "completed_at", type: "timestamptz", nullable: false })
  completedAt!: Date;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
