import {IsString, MinLength,IsNotEmpty,IsNumber,IsPositive,IsMongoId, IsEnum} from "class-validator"
import { RatingCategories } from "../schemas/rating-categories.schema";
export class CreateReviewDto {
    @IsMongoId()
    @IsString({ message: 'shopId must be a string' })
    @IsNotEmpty({ message: 'shopId is required' })
    shopId: string;

    @IsString({message: "review content must be string"})
    content?: string;

    @IsEnum(RatingCategories,{message : "rating is invalid"})
    @IsNumber()
    @IsNotEmpty({message : 'rating is required'})
    rating: RatingCategories;
}
