import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import User from "./User";
import WorkoutExercise from "./WorkoutExercise";

@ObjectType()
@Entity("workout_sessions")
@Index("IDX_workout_sessions_user_date", ["userId", "performedOn"])
export default class WorkoutSession {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.workoutSessions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar", length: 150, nullable: false })
  name!: string;

  @Column({ name: "workout_type", type: "varchar", length: 30, nullable: false })
  workoutType!: string;

  @Column({ name: "performed_on", type: "date", nullable: false })
  performedOn!: string;

  @Column({ name: "duration_minutes", type: "integer", nullable: false })
  durationMinutes!: number;

  @Column({ name: "calories_burned", type: "integer", nullable: true })
  caloriesBurned?: number | null;

  @Column({ type: "varchar", length: 30, nullable: true })
  intensity?: string | null;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @OneToMany(() => WorkoutExercise, (exercise) => exercise.session, {
    cascade: true,
  })
  exercises?: WorkoutExercise[];

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
