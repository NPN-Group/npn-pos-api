import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from './create-table.dto';
import {IsString, MinLength,IsNotEmpty,IsNumber,IsPositive,IsMongoId,IsISO8601, IsOptional } from "class-validator"

export class UpdateTableDto {
        @IsMongoId()
        @IsString({ message: 'activeTicket must be a string' })
        // @IsNotEmpty({ message: 'activeTicket is required' })
        @IsOptional()
        activeTicket?: string;
    
        @IsNumber()
        @IsPositive({ message: 'seats must be a Positive' })
        // @IsNotEmpty({ message: 'seats is required' })
        seats?:number;
    
        @IsNumber()
        @IsPositive({ message: 'TableNumber must be a Positive' })
        // @IsNotEmpty({ message: 'TableNumber is required' })
        @IsOptional()
        tableNumber?:number;

        @IsISO8601({}, { message: 'startTime must be a valid ISO 8601 date string' })
        // @IsNotEmpty({ message: 'startTime is required' })
        @IsOptional()
        startTime: string;
}
