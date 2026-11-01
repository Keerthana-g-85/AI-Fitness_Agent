import bcrypt from "bcryptjs";
import { QueryFailedError } from "typeorm";
import CreateUserArguments from "../Arguments/UserArguments/CreateUser";
import LoginArguments from "../Arguments/UserArguments/Login";
import User from "../Model/User";
import UserResponse from "../Response/UserResponse";
import LoginResponse, { AuthUserResponse } from "../Response/LoginResponse";
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

const toAuthUser = (user: User): AuthUserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  onboardingCompleted: user.onboardingCompleted,
  onboardingCompletedAt: user.onboardingCompletedAt ?? null,
});

export default class UserService {
  async loginUser(input: LoginArguments): Promise<LoginResponse> {
    const email =
      typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const password = typeof input.password === "string" ? input.password : "";

    if (!email) {
      return { success: false, message: "Email is required" };
    }

    if (!EMAIL_REGEX.test(email)) {
      return { success: false, message: "Enter a valid email address" };
    }

    if (!password) {
      return { success: false, message: "Password is required" };
    }

    const userRepository = database.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return { success: false, message: "Invalid email or password" };
    }

    return {
      success: true,
      message: "Login successful",
      token: createAuthToken(user.id, input.rememberMe ? "30d" : "1d"),
      user: toAuthUser(user),
    };
  }

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
