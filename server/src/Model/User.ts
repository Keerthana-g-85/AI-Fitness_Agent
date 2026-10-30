import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity("users")
export default class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 100, nullable: false })
  name!: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password!: string;
}
