import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RatingCategories } from "../schemas/rating-categories.schema";

export type ReviewDocument = HydratedDocument<Review>;
@Schema()
export class Review {
    @Prop({required:true})
    shopId:string;

    @Prop({required:true})
    content:string;

    @Prop({type: Date, default: Date.now})
    timeStamp: Date;

    @Prop({required:true})
    rating:RatingCategories;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});