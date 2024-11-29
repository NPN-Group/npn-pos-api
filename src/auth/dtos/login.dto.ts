import { z } from "zod";

export const LoginDtoSchema = z.object({
  email: z
    .string({ required_error: "Email is required", invalid_type_error: "Email must be a string" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required", invalid_type_error: "Password must be a string" })
    .min(8, "Password length must be at least 8 characters"),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;
