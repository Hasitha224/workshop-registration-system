import { Router } from "express";
import { createUser, listUsers, updateUser } from "../controllers/user.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate, requireRole("admin"));
router.post("/", createUser);
router.get("/", listUsers);
router.patch("/:id", updateUser);

export default router;