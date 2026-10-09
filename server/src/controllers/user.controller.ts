import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { parseId } from "../utils/parse-id.js";
import { toPublicUser } from "../utils/serializers.js";
import { createSchema, updateSchema } from "../schemas/user.schema.js";

export const createUser = asyncHandler(async (req, res) => {
  const { password, ...rest } = createSchema.parse(req.body);
  const user = await User.create({ ...rest, passwordHash: await bcrypt.hash(password, 10) });
  res.status(201).json({ user: toPublicUser(user) });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users: users.map(toPublicUser) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { password, ...data } = updateSchema.parse(req.body);

  // Stop an Admin from locking everyone out
  if (req.user?.id === id && ((data.role && data.role !== "admin") || data.isActive === false)) {
    throw new AppError("You cannot demote or deactivate your own account", 400);
  }

  const update: Record<string, unknown> = { ...data };
  if (password) update.passwordHash = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!user) throw new AppError("User not found", 404);
  res.json({ user: toPublicUser(user) });
});