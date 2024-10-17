import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email!" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

// Extended schema for sign-up, confirm password fields
export const signUpSchema = authSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Set the path of the error
  });
