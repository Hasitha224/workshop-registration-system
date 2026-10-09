import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONGODB_URI: z.string().trim().min(1, "MongoDB URI is required"),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:5173")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must contain at least 32 characters"),
  JWT_EXPIRES_IN: z
    .string()
    .default("24h")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment configuration: ",
    parsedEnv.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsedEnv.data;