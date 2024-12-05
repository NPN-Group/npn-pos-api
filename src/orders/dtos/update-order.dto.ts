import {z} from 'zod';

export const UpdateOrderSchema = z.object({
    status: z.string({
        message: "Status must be a string"
    }).min(1, {
        message: "Status is required"
    })
});

export type UpdateOrderDto = z.infer<typeof UpdateOrderSchema>;
