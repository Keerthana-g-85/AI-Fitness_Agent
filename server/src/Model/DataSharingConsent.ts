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
@Entity("data_sharing_consents")
@Index("IDX_data_sharing_consents_user_id", ["userId"])
export default class DataSharingConsent {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.dataSharingConsents, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "consent_given", type: "boolean", nullable: false })
  consentGiven!: boolean;

  @Column({ name: "consent_version", type: "varchar", length: 50, nullable: false })
  consentVersion!: string;

  @Column({ name: "consented_at", type: "timestamptz", nullable: false })
  consentedAt!: Date;

  @Column({ name: "withdrawn_at", type: "timestamptz", nullable: true })
  withdrawnAt?: Date | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
