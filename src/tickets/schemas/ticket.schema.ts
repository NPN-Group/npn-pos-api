import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StatusTicket } from './status.schema';

export type TicketDocument = HydratedDocument<Ticket>;
@Schema()
export class Ticket {
    @Prop({required: true})
    tableId: string

    @Prop({required: true})
    quantity: number

    @Prop({required: true})
    status: StatusTicket
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);
TicketSchema.set('toJSON',{
    transform: (doc,ret) => {
        if (ret._id){
            ret.id = ret._id;
        }
        delete ret._id;
        delete ret.__v;
    }
});