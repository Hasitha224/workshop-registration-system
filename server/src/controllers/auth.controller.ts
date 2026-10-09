import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { toPublicUser } from "../utils/serializers.js";
import { loginSchema } from "../schemas/auth.schema.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash",
  );
  const passwordOk = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;
  if (!user || !passwordOk || !user.isActive) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "24",
  });
  res.json({ token, user: toPublicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
