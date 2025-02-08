import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Shop,ShopDocument } from 'src/shops/schemas/shop.schema';

export type TableDocument = HydratedDocument<Table>;

@Schema()
export class Table {
  @Prop({ type: Types.ObjectId, required: true, ref: Shop.name}) // ✅ shopId CAN be duplicated
  shopId: ShopDocument;

  @Prop({unique:true}) 
  activeTicket: string;

  @Prop({ type: Number, min: 1 })
  seats: number;

  @Prop({  type: Number, min: 1,unique:true })
  tableNumber: number;

  @Prop({})
  startTime: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);

TableSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
