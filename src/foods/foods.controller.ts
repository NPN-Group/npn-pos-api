import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserDocument, UserRole } from 'src/users/schemas';
import { FoodsService } from './foods.service';
import { CreateFoodSchema, CreateFoodDto } from './dtos/create-food.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { checkFileNameEncoding, generateRandomFileName } from 'src/common/utills';
import { UpdateShopDto } from 'src/shops/dtos';
import { UpdateFoodsSchema } from './dtos/update-food.dto';

@Controller('foods')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.USER)
export class FoodsController {
    constructor(private readonly foodsService: FoodsService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('food-image', {
          storage: diskStorage({
            destination: "./uploads",
            filename: (_, file, cb) => {
              const [originalFilename, fileExt] = file.originalname.split('.');
              const extension = file.mimetype.split("/")[1];
              let filename: string;
              const id = Date.now();
              if (!checkFileNameEncoding(originalFilename)) filename = `${generateRandomFileName()}-${id}.${extension}`;
              else filename = `${originalFilename}-${id}.${extension}`;
              cb(null, filename);
            },
          }),
          limits: { fileSize: 1024 * 1024 * 10 },
          fileFilter: (_, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
              cb(null, true);
            } else {
              cb(new Error('File type not supported'), false);
            }
          }
        })
      )
    async create(@Body("json") json: any, @CurrentUser() user: UserDocument, @UploadedFile() image: Express.Multer.File) {
        const jsonParsed = JSON.parse(json);
        const createFoodDto = {
            ...jsonParsed,
            img: image?.filename || null,
        }as CreateFoodDto;

        const data = CreateFoodSchema.parse(createFoodDto);

        const res = await this.foodsService.create(data, data.shop);
        return {
            statusCode : HttpStatus.OK,
            message : 'Food created successfully',
            data : res
        }

    }

    @Post('all')
    async findAll(@Body() { shop }: { shop: string }, @CurrentUser() user: UserDocument) {
      if (!shop) {
        throw new BadRequestException('shopId is required');
      }
  
      const res = await this.foodsService.findAll(shop);
      return {
        statusCode: HttpStatus.OK,
        message: 'All Foods fetched successfully',
        data: res,
      };
    }

    @Get(':id')
    async findOne( @Param ('id') id: string,@CurrentUser() user: UserDocument) {

        const res = await this.foodsService.findOne(id);
        return {
            statusCode : HttpStatus.OK,
            message : 'Food fetched successfully',
            data : res
        }
    }

    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('food-image', {
            storage: diskStorage({
              destination: "./uploads",
              filename: (_, file, cb) => {
                const [originalFilename, fileExt] = file.originalname.split('.');
                const extension = file.mimetype.split("/")[1];
                let filename: string;
                const id = Date.now();
                if (!checkFileNameEncoding(originalFilename)) filename = `${generateRandomFileName()}-${id}.${extension}`;
                else filename = `${originalFilename}-${id}.${extension}`;
                cb(null, filename);
              },
            }),
            limits: { fileSize: 1024 * 1024 * 10 },
            fileFilter: (_, file, cb) => {
              if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                cb(null, true);
              } else {
                cb(new Error('File type not supported'), false);
              }
            }
          })
      )

    async update(@Body("json") json: any, @Param('id') id: string,@CurrentUser() user: UserDocument , @UploadedFile() image: Express.Multer.File) {
        const jsonParsed = JSON.parse(json);
        const updateFoodDto = {
            ...jsonParsed,
            img: image?.filename || null,
        }as UpdateShopDto;

        const data = UpdateFoodsSchema.parse(updateFoodDto);

        const res = await this.foodsService.update(json,id, data);
        return {
            statusCode : HttpStatus.OK,
            message : 'Food updated successfully',
            data : res
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string,@CurrentUser() user: UserDocument) {

        await this.foodsService.remove(id);
        return {
            statusCode : HttpStatus.OK,
            message : 'Food removed successfully'
        }
    }
    
    @Delete()
    async removeAll(@Body() {shop}, @CurrentUser() user: UserDocument) {
        
        if (!shop) {
            throw new BadRequestException('shopId is required');
        }

        await this.foodsService.removeAll(shop);
        return {
            statusCode : HttpStatus.OK,
            message : 'All Foods removed successfully'
        }
    }
}
