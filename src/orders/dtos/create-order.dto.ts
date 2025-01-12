import { Types } from 'mongoose';
import { z } from 'zod';

export const CreateOrderSchema = z.object({
    timestamp: z.string({
        message: "Timestamp must be a string"
    }).nullable(),
    status: z.string({
        message: "Status must be a string"
    }).optional().nullable(),
    ticket: z.string({
        message: "Ticket must be a string"
    }).refine((value) => Types.ObjectId.isValid(value), {
        message: "Ticket must be a valid ObjectId"
    }),

});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;