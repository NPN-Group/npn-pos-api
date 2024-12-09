import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas';
import { ShopStatus } from './shop-status.schema';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true, versionKey: false })
export class Shop {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  owner: UserDocument;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: '' })
  location: string;

  @Prop({default: null})
  img: string | null;

  @Prop({ enum: ShopStatus, default: ShopStatus.ACTIVE })
  status: ShopStatus;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

ShopSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret._id) {
      ret.id = ret._id;
    }
    delete ret._id;
  }
});
