import { z } from "zod";
import { UserRole } from "src/users/schemas";

export const JwtPayloadSchema = z.object({
    sub: z.string({ required_error: "Invalid id format" }).regex(/^[a-f\d]{24}$/i, "Invalid id format"),
    role: z.nativeEnum(UserRole, { required_error: "Role is required", invalid_type_error: "Invalid role" }),
    iat: z.number().optional(),
    exp: z.number().optional(),
    nbf: z.number().optional(),
    jti: z.string().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
