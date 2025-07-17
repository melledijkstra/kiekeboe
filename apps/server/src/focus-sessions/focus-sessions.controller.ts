import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { FocusSessionsService } from './focus-sessions.service';
import { FocusSession } from '../types';

@Controller('focus-sessions')
export class FocusSessionsController {
  constructor(private readonly service: FocusSessionsService) {}

  @Get()
  findAll(): Promise<FocusSession[]> {
    return this.service.findAll();
  }

  @Post()
  async create(
    @Body('duration') duration: number,
    @Body('task') task: string,
  ): Promise<FocusSession> {
    if (!duration || !task) {
      throw new HttpException('Duration and task are required', HttpStatus.BAD_REQUEST);
    }
    return this.service.create({ duration, task });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FocusSession> {
    const session = await this.service.findOne(Number(id));
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('duration') duration: number,
    @Body('task') task: string,
  ): Promise<FocusSession> {
    if (!duration || !task) {
      throw new HttpException('Duration and task are required', HttpStatus.BAD_REQUEST);
    }
    const session = await this.service.update(Number(id), { duration, task });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const ok = await this.service.remove(Number(id));
    if (!ok) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
  }
}
