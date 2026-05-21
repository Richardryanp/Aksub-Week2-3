import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { HttpError } from "../utils/httpError";
import { toUserResponse } from "../utils/serializers";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const jwtSecret = () => process.env.JWT_SECRET || "dev-secret-key";

export const register = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new HttpError(409, "Email already registered");
  }

  const password = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password,
      role: "attendee",
    },
  });

  return toUserResponse(user);
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(input.password, user.password);

  if (!isValid) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret(),
    { expiresIn: "1h" },
  );

  return {
    token,
    user: toUserResponse(user),
  };
};
