import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsUrl()
  location?: string;

  @IsOptional()
  @IsString()
  img?: string;
}
