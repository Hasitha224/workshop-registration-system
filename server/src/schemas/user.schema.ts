import z from "zod";
import { ROLES } from "../constants.ts/user.constants.js";

export const createSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLES),
});

export const updateSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    role: z.enum(ROLES).optional(),
    isActive: z.boolean().optional(),
    password: z.string().min(8).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: "Nothing to update" });