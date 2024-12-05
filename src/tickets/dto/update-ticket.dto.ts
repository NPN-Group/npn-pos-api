import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { StatusTicket } from "../schemas/status.schema";
import {IsString, MinLength,IsEnum,IsNotEmpty,IsNumber,IsPositive,IsMongoId} from "class-validator"

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsMongoId()
    @IsString()
    @IsNotEmpty({message : "tableId is required"})
    tableId?: string

    @IsNumber()
    @IsNotEmpty({message : "quantity is required"})
    quantity?: number;

    @IsEnum(StatusTicket,{message : "status is invalid"})
    @IsString({message : 'status must be as string'})
    @IsNotEmpty({message : 'status is required'})
    status?: StatusTicket;
}
