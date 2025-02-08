import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {Types} from 'mongoose';
import { UserRole } from 'src/users/schemas';
import {Roles } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards';

@Roles(UserRole.USER)
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.reviewsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: Types.ObjectId, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.reviewsService.remove(id);
  }
}
