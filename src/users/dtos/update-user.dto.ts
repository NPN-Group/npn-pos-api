import { z } from "zod";

export const UpdateUserSchema = z.object({
    password: z
        .string({ message: "Password must be a string" })
        .min(8, { message: "Password length must be at least 8 characters" })
        .optional(),

    firstName: z
        .string({ message: "First name must be a string" })
        .refine((val) => val.trim().length > 0, { message: "First name is required" })
        .optional(),

    lastName: z
        .string({ message: "Last name must be a string" })
        .refine((val) => val.trim().length > 0, { message: "Last name is required" })
        .optional(),

    img: z
        .string({ message: "Image must be a string" })
        .refine((val) => val.trim().length > 0, { message: "Image name is required" })
        .optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
