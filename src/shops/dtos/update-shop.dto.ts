import { z } from 'zod';

export const UpdateShopSchema = z.object({
  name: z.string()
    .optional()
    .nullable()
    .refine(value => value === undefined || typeof value === 'string', { message: 'Name must be a string' }),

  phone: z.string()
    .optional()
    .nullable()
    .refine(value => value === undefined || typeof value === 'string', { message: 'Description must be a string' }),

  location: z.string()
    .optional()
    .nullable()
    .refine(value => value === undefined || typeof value === 'string', { message: 'Location must be a string' }),

  img: z.string()
    .optional()
    .nullable()
    .refine(value => value === undefined || typeof value === 'string', { message: 'Img must be a string' }),
});

export type UpdateShopDto = z.infer<typeof UpdateShopSchema>;
