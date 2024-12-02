import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class FindOneParamsDto {
    @IsMongoId()
    @IsString()
    @IsNotEmpty()
    id: string;
}
