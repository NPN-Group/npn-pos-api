import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type TableDocument = HydratedDocument<Table>;
@Schema()
export class Table {
    @Prop({required:true})
    shopId:string

    @Prop({required:true, unique: true})
    activeTicket:string

    @Prop({required:true, isInteger:true})
    seats:number
    
    @Prop({required:true, isInteger:true})
    tableNumber:number
    
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
