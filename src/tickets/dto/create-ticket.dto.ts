import {IsString, IsEnum,IsNotEmpty,IsNumber,IsPositive,IsMongoId} from "class-validator";
import { StatusTicket } from "../schemas/status.schema";
export class CreateTicketDto { 
    @IsMongoId()
    @IsString()
    @IsNotEmpty({message : "tableId is required"})
    tableId: string

    @IsNumber()
    @IsNotEmpty({message : "quantity is required"})
    quantity: number;

    @IsEnum(StatusTicket,{message : "status is invalid"})
    @IsString({message : 'status must be as string'})
    @IsNotEmpty({message : 'status is required'})
    status : StatusTicket;

}
