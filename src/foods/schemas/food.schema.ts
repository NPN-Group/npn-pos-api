import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Shop } from "src/shops/schemas";
import { FoodStatus } from "./food-status.schema";

export type FoodDocument = HydratedDocument<Food>;

@Schema({ timestamps: true })
export class Food {
    @Prop({ type: Types.ObjectId, required: true, ref: Shop.name })
    shop: Types.ObjectId; // Reference to Shop

    @Prop({ required: true, minlength: 2 })
    name: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ default: null })
    description: string | null;

    @Prop({ default: null })
    img: string | null;

    @Prop({ default: null })
    category: string | null;

    @Prop({ enum: FoodStatus, default: FoodStatus.ACTIVE })
    status: FoodStatus;
}

export const FoodSchema = SchemaFactory.createForClass(Food);

// Customize JSON output
FoodSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
