import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas';

export type ShopDocument = Shop & Document;

export enum ShopStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Shop {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  owner: Types.ObjectId; // No unique constraint here

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  location: string;

  @Prop()
  img: string;

  @Prop({ enum: ShopStatus, default: ShopStatus.ACTIVE })
  status: ShopStatus;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

ShopSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id; // Expose `_id` as `id` in the response
    delete ret._id;
    delete ret.__v;
  },
});
