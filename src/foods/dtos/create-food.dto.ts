import { z } from 'zod';
import { Types } from 'mongoose';

export const CreateFoodSchema = z.object({
    name: z.string({
        message: "Name must be a string"
    }).min(1, {
        message: "Name is required"
    }),
    price: z.number({
        message: "Price must be a number"
    }).min(1, {
        message: "Price must be at least 1"
    }),
    description: z.string({
        message: "Description must be a string"
    }).optional().nullable(),
    category: z.string({
        message: "Category must be a string"
    }).optional().nullable(),
    img: z.string({
        message: "Image must be a string"
    }).optional().nullable(),
    shop: z.string({
        message: "Shop must be a string"
    }).refine((value) => Types.ObjectId.isValid(value), {
        message: "Shop must be a valid ObjectId"
    }),
});

export type CreateFoodDto = z.infer<typeof CreateFoodSchema>;
