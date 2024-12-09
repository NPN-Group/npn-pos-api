import { IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdateShopDto {

  @MinLength(1, { message: "Shop name length must be at least 1 characters" })
  @IsString({ message: "Shop name must be a string" })
  @IsOptional()
  name: string;

  @IsPhoneNumber('TH', { message: "Phone Number is invalid" })
  @IsString({ message: "Phone Number must be a string" })
  @IsOptional()
  phone: string;

  @IsString({ message: "Location must be a string" })
  @IsOptional()
  location: string;
}
