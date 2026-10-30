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
@Entity("user_profiles")
@Index("IDX_user_profiles_user_id", ["userId"], { unique: true })
export default class UserProfile {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @OneToOne(() => User, (user) => user.profile, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "date_of_birth", type: "date", nullable: false })
  dateOfBirth!: string;

  @Column({ name: "height_cm", type: "numeric", precision: 5, scale: 2, nullable: false })
  heightCm!: string;

  @Column({ type: "varchar", length: 30, nullable: false })
  gender!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  occupation?: string | null;

  @Column({ type: "varchar", length: 120, nullable: false })
  country!: string;

  @Column({ name: "activity_level", type: "varchar", length: 50, nullable: false })
  activityLevel!: string;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
