import { z } from "zod";

export const LoginFormValidation = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username must be at most 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must be at most 50 characters"),
});
