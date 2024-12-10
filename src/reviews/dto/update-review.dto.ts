import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import {IsString, MinLength,IsNotEmpty,IsNumber,IsPositive,IsMongoId, IsEnum} from "class-validator"
import { RatingCategories } from "../schemas/rating-categories.schema";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    @IsMongoId()
    @IsString({ message: 'shopId must be a string' })
    shopId?: string;

    @IsString({message: "review content must be string"})
    content?: string;

    @IsEnum(RatingCategories,{message : "rating is invalid"})
    @IsNumber()
    rating?: RatingCategories;
}
