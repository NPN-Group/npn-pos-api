import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from './schemas/table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(@InjectModel(Table.name) private tableModel: Model<TableDocument>) {}

  async create(shopId: Types.ObjectId, createTableDto: CreateTableDto): Promise<TableDocument> {
    const newTable = new this.tableModel({ ...createTableDto, shopId });
    return newTable.save();
  }

  async findAll(shopId: Types.ObjectId): Promise<TableDocument[]> {
    return this.tableModel.find({ shopId }).exec();
  }

  async findById(shopId: Types.ObjectId, tableId: Types.ObjectId): Promise<TableDocument> {
    const table = await this.tableModel.findOne({ _id: tableId, shopId }).exec();
    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found in shop ${shopId}`);
    }
    return table;
  }

  async update(shopId: Types.ObjectId, tableId: Types.ObjectId, updateTableDto: UpdateTableDto): Promise<TableDocument> {
    const table = await this.tableModel.findOneAndUpdate(
      { _id: tableId, shopId },
      updateTableDto,
      { new: true }
    ).exec();

    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found in shop ${shopId}`);
    }
    return table;
  }

  async remove(shopId: Types.ObjectId, tableId: Types.ObjectId): Promise<TableDocument> {
    const table = await this.tableModel.findOneAndDelete({ _id: tableId, shopId }).exec();
    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found in shop ${shopId}`);
    }
    return table;
  }
}
