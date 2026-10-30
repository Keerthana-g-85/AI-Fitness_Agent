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
@Entity("work_life")
@Index("IDX_work_life_user_id", ["userId"], { unique: true })
export default class WorkLife {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @OneToOne(() => User, (user) => user.workLife, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "work_type", type: "varchar", length: 80, nullable: false })
  workType!: string;

  @Column({ name: "work_start_time", type: "time", nullable: true })
  workStartTime?: string | null;

  @Column({ name: "work_end_time", type: "time", nullable: true })
  workEndTime?: string | null;

  @Column({ name: "working_days", type: "jsonb", nullable: false, default: () => "'[]'" })
  workingDays: string[] = [];

  @Column({ name: "daily_sitting_hours", type: "numeric", precision: 4, scale: 2, nullable: true })
  dailySittingHours?: string | null;

  @Column({ name: "daily_standing_hours", type: "numeric", precision: 4, scale: 2, nullable: true })
  dailyStandingHours?: string | null;

  @Column({ name: "daily_commute_time", type: "integer", nullable: true })
  dailyCommuteTime?: number | null;

  @Column({ name: "sleep_time", type: "time", nullable: false })
  sleepTime!: string;

  @Column({ name: "wake_up_time", type: "time", nullable: false })
  wakeUpTime!: string;

  @Column({ name: "stress_level", type: "varchar", length: 30, nullable: true })
  stressLevel?: string | null;

  @Column({ name: "free_time", type: "varchar", length: 50, nullable: false })
  freeTime!: string;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
