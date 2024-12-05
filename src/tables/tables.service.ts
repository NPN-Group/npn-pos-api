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

  async update(id: Types.ObjectId, updateTableDto: UpdateTableDto) {
    const table = await this.tableModel.findByIdAndUpdate(id, updateTableDto, { new: true })
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return table;
  }

  async remove(id: Types.ObjectId) {
    const table = await this.tableModel.findByIdAndDelete(id);
    if (!table){
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return table;
  }
}
