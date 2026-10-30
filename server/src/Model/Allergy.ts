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
@Entity("allergies")
@Index("IDX_allergies_user_id", ["userId"])
export default class Allergy {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.allergies, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "allergy_name", type: "varchar", length: 200, nullable: false })
  allergyName!: string;

  @Column({ name: "allergy_type", type: "varchar", length: 50, nullable: true })
  allergyType?: string | null;

  @Column({ type: "varchar", length: 30, nullable: true })
  severity?: string | null;

  @Column({ type: "text", nullable: true })
  reaction?: string | null;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
