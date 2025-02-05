import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from './create-table.dto';
import {IsString, MinLength,IsNotEmpty,IsNumber,IsPositive,IsMongoId,IsISO8601 } from "class-validator"

export class UpdateTableDto extends PartialType(CreateTableDto) {
        // @IsMongoId()
        @IsString({ message: 'shopId must be a string' })
        @IsNotEmpty({ message: 'shopId is required' })
        shopId: string;
    
        @IsMongoId()
        @IsString({ message: 'activeTicket must be a string' })
        @IsNotEmpty({ message: 'activeTicket is required' })
        activeTicket?: string;
    
        @IsNumber()
        @IsPositive({ message: 'seats must be a Positive' })
        @IsNotEmpty({ message: 'seats is required' })
        seats?:number;
    
        @IsNumber()
        @IsPositive({ message: 'TableNumber must be a Positive' })
        @IsNotEmpty({ message: 'TableNumber is required' })
        tableNumber?:number;

        @IsISO8601({}, { message: 'startTime must be a valid ISO 8601 date string' })
        @IsNotEmpty({ message: 'startTime is required' })
        startTime: string;
}
