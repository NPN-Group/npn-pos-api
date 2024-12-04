import { z } from 'zod';
import { Types } from 'mongoose';

export const UpdateFoodsSchema = z.object({
    name: z.string({
        message: "Name must be a string"
    }).min(1, {
        message: "Name is required"
    }).optional().nullable(),
    price: z.number({
        message: "Price must be a number"
    }).min(1, {
        message: "Price must be at least 1"
    }).optional().nullable(),
    description: z.string({
        message: "Description must be a string"
    }).optional().nullable(),
    category: z.string({
        message: "Category must be a string"
    }).optional().nullable(),
    img: z.string({
        message: "Image must be a string"
    }).optional().nullable(),
});

export type CreateFoodDto = z.infer<typeof UpdateFoodsSchema>;
