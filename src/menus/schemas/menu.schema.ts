import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Food } from "src/foods/schemas";
import { Order } from "src/orders/schemas";

export type MenuDocument = HydratedDocument<Menu>;

@Schema({ timestamps: true })
export class Menu {
    @Prop({type: Types.ObjectId, required: true, ref: Order.name})
    order: Types.ObjectId;

    @Prop({type: Types.ObjectId, required: true, ref: Food.name})
    food: Types.ObjectId;

    @Prop({required: true, min: 1})
    quantity: number;

    @Prop({default: null})
    describe: string | null;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

// Customize JSON output
MenuSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});