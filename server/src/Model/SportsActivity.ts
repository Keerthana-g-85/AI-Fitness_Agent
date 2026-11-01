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
@Entity("sports_activities")
@Index("IDX_sports_activities_user_date", ["userId", "activityDate"])
export default class SportsActivity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.sportsActivities, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "sport_name", type: "varchar", length: 100, nullable: false })
  sportName!: string;

  @Column({ name: "activity_date", type: "date", nullable: false })
  activityDate!: string;

  @Column({ name: "duration_minutes", type: "integer", nullable: false })
  durationMinutes!: number;

  @Column({ type: "varchar", length: 30, nullable: true })
  intensity?: string | null;

  @Column({ name: "calories_burned", type: "integer", nullable: true })
  caloriesBurned?: number | null;

  @Column({ type: "varchar", length: 120, nullable: true })
  location?: string | null;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
