import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "fitness_db",
  synchronize: true,
  logging: false,
  entities: [User],
});