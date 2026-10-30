import bcrypt from "bcryptjs";
import { QueryFailedError } from "typeorm";
import CreateUserArguments from "../Arguments/UserArguments/CreateUser";
import User from "../Model/User";
import UserResponse from "../Response/UserResponse";
import { createAuthToken } from "../auth";
import { database } from "../database";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_LENGTH_REGEX = /.{8,}/;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHARACTER_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/;'`~]/;
const SALT_ROUNDS = 10;

const isUniqueViolation = (error: unknown): boolean => {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = (error as QueryFailedError & { driverError?: { code?: string } })
    .driverError;

  return driverError?.code === "23505";
};

export default class UserService {
  async createUser(input: CreateUserArguments): Promise<UserResponse> {
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const password = typeof input.password === "string" ? input.password : "";

    const validationMessage = this.validateInput(name, email, password);

    if (validationMessage) {
      return { success: false, message: validationMessage };
    }

    const userRepository = database.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let createdUser: User;

    try {
      const user = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      createdUser = await userRepository.save(user);
    } catch (error) {
      if (isUniqueViolation(error)) {
        return { success: false, message: "Email already registered" };
      }

      throw error;
    }

    return {
      success: true,
      message: "Registration successful",
      token: createAuthToken(createdUser.id),
    };
  }

  private validateInput(name: string, email: string, password: string): string | null {
    if (!name) {
      return "Name is required";
    }

    if (!email) {
      return "Email is required";
    }

    if (!EMAIL_REGEX.test(email)) {
      return "Enter a valid email address";
    }

    if (!password) {
      return "Password is required";
    }

    if (!MIN_LENGTH_REGEX.test(password)) {
      return "Password must be at least 8 characters";
    }

    if (!UPPERCASE_REGEX.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!LOWERCASE_REGEX.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    if (!NUMBER_REGEX.test(password)) {
      return "Password must contain at least one number";
    }

    if (!SPECIAL_CHARACTER_REGEX.test(password)) {
      return "Password must contain at least one special character";
    }

    return null;
  }
}
