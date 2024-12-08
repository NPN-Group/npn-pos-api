import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Model,Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket,TicketDocument } from './schemas/ticket.schema';
@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private ticketModel:Model<Ticket>){}

  async create(createTicketDto: CreateTicketDto): Promise<TicketDocument> {
    const newTicket = new this.ticketModel(createTicketDto);
    return newTicket.save();
  }

  async findAll(): Promise<TicketDocument[]> {
    return this.ticketModel.find();
  }

  async findById(id: Types.ObjectId) : Promise<TicketDocument>{
    const existingTicket = await this.ticketModel.findById(id);
    if (!existingTicket){
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return existingTicket;
  }

  async update(id: Types.ObjectId, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketModel.findByIdAndUpdate(id, updateTicketDto, { new: true })
    if (!ticket){
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return ticket;
  }

  async remove(id: Types.ObjectId) {
    const ticket = await this.ticketModel.findByIdAndDelete(id)
    if (!ticket){
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return ticket;
  }
}
