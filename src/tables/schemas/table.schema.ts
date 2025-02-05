import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Shop } from 'src/shops/schemas/shop.schema';

export type TableDocument = HydratedDocument<Table>;

@Schema()
export class Table {
  @Prop({ type: Types.ObjectId, required: true, ref: Shop.name}) // ✅ shopId CAN be duplicated
  shopId: Types.ObjectId;

  @Prop({ required: true, unique: true }) 
  activeTicket: string;

  @Prop({ required: true, type: Number, min: 1 })
  seats: number;

  @Prop({ required: true, type: Number, min: 1 , unique: true})
  tableNumber: number;

  @Prop({ required: true })
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
