import {z} from 'zod';
import {Types} from 'mongoose';

export const CreateMenuSchema = z.object({
    order: z.string({
        message: "Order must be a string"
    }).refine((value) => Types.ObjectId.isValid(value), {
        message: "Order must be a valid ObjectId"
    }),
    food: z.string({
        message: "Food must be a string"
    }).refine((value) => Types.ObjectId.isValid(value), {
        message: "Food must be a valid ObjectId"
    }),
    quantity: z.number({
        message: "Quantity must be a number"
    }).min(1, {
        message: "Quantity must be at least 1"
    }),
    describe: z.string({
        message: "Description must be a string"
    }).optional().nullable(),
})

export type CreateMenuDto = z.infer<typeof CreateMenuSchema>;