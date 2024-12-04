import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import {Table,TableDocument} from './schemas/table.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class TablesService {
  constructor(@InjectModel(Table.name) private tableModel:Model<TableDocument>){}
  async create(createTableDto: CreateTableDto): Promise<TableDocument> {
    const newTable = new this.tableModel(createTableDto);
    return newTable.save();
  }

  async findAll(): Promise<TableDocument[]>{
    return this.tableModel.find();
  }

  async findById(id: Types.ObjectId): Promise<TableDocument> {
    const existingTable = await this.tableModel.findById(id);
    if (!existingTable){
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return existingTable;
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}
