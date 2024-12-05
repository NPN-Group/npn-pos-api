import {IsString, MinLength,IsNotEmpty,IsNumber,IsPositive,IsMongoId} from "class-validator"

export class CreateTableDto {
    @IsMongoId()
    @IsString({ message: 'shopId must be a string' })
    @IsNotEmpty({ message: 'shopId is required' })
    shopId: string;

    @IsMongoId()
    @IsString({ message: 'activeTicket must be a string' })
    @IsNotEmpty({ message: 'activeTicket is required' })
    activeTicket: string;

    @IsNumber()
    @IsPositive({ message: 'seats must be a Positive' })
    @IsNotEmpty({ message: 'seats is required' })
    seats:number;

    @IsNumber()
    @IsPositive({ message: 'TableNumber must be a Positive' })
    @IsNotEmpty({ message: 'TableNumber is required' })
    tableNumber:number;
}
