import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review,ReviewDocument } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel:Model<ReviewDocument>){}
  async create(createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
    const newReview = new this.reviewModel(createReviewDto);
    return newReview.save()
  }

  async findAll(): Promise<ReviewDocument[]> {
    return this.reviewModel.find();
  }

  async findById(id: Types.ObjectId): Promise<ReviewDocument>{
    const existingReview = await this.reviewModel.findById(id);
    if (!existingReview){
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return existingReview;
  }

  async update(id: Types.ObjectId, updateReviewDto: UpdateReviewDto):Promise<ReviewDocument> {
    console.log(updateReviewDto);
    const review = await this.reviewModel.findByIdAndUpdate(id,updateReviewDto, { new: true });
    console.log(review);
    if (!review){
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  async remove(id: Types.ObjectId) {
    const review = await this.reviewModel.findByIdAndDelete(id);
    if (!review){
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }
}
