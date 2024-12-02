import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateShopDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsUrl()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    img?: string;
}
