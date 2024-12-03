import { z } from 'zod';

export const CreateShopSchema = z.object({
  name: z.string({ message: "Name must be a string" })
    .min(1, { message: "Name is required" }),

  phone: z.string({ message: "Phone number must be a string" }),

  location: z.string({ message: "Location must be a string" })
    .optional()
    .nullable(),
  
  img: z.string({ message: "Image must be a string" })
    .optional()
    .nullable(),
});

export type CreateShopDto = z.infer<typeof CreateShopSchema>;
