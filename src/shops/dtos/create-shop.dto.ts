import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateShopDto {

  @MinLength(1, { message: "Shop name length must be at least 1 characters" })
  @IsString({ message: "Shop name must be a string" })
  @IsNotEmpty({ message: "Shop name is required" })
  name: string;

  @IsPhoneNumber('TH', { message: "Phone Number is invalid" })
  @IsString({ message: "Phone Number must be a string" })
  @IsNotEmpty({ message: "Phone Number is required" })
  phone: string;

  @IsString({ message: "Location must be a string" })
  @IsOptional({ message: "Location is required" })
  location: string;
}
