import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OrderStatus } from "./order-status.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    // Reference to the Ticket model
    @Prop({ type: Types.ObjectId, required: true, ref: 'MockupTicket' })
    ticket: Types.ObjectId;

    // Auto-generated timestamp
    @Prop({ type: Date, default: Date.now })
    timestamp: Date;

    // Enum for status
    @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.InProcess })
    status: OrderStatus;
}

// Generate Mongoose schema
export const OrderSchema = SchemaFactory.createForClass(Order);

// Transform output to adjust the JSON structure
OrderSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
