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
@Entity("sleep_records")
@Index("IDX_sleep_records_user_date", ["userId", "sleepDate"], { unique: true })
export default class SleepRecord {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.sleepRecords, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "sleep_date", type: "date", nullable: false })
  sleepDate!: string;

  @Column({ name: "bed_time", type: "varchar", length: 5, nullable: true })
  bedTime?: string | null;

  @Column({ name: "wake_time", type: "varchar", length: 5, nullable: true })
  wakeTime?: string | null;

  @Column({ name: "duration_minutes", type: "integer", nullable: false })
  durationMinutes!: number;

  @Column({ type: "varchar", length: 30, nullable: true })
  quality?: string | null;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
