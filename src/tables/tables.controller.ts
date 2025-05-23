import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import {Types} from 'mongoose';
import { UserRole } from 'src/users/schemas';
import {Roles } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards';

@Roles(UserRole.USER)
@UseGuards(JwtAuthGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: Types.ObjectId) {
    return this.tablesService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: Types.ObjectId, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.tablesService.remove(id);
  }
}
