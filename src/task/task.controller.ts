import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginationResult } from './interface/pagination-result.interface';
import { SummaryTask } from './interface/summary.interface';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    try {
      const task: Task = await this.taskService.create(createTaskDto);
      return {
        success: true,
        message: 'Created successfully',
        data: task,
      };
    } catch (error) {
      throw new HttpException('Error creating a task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    try {
      const task = await this.taskService.find(id);
      if (!task) {
        throw new NotFoundException(`The task does not exist`);
      }
      await this.taskService.delete(id);
      return {
        success: true,
        message: 'Deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Error deleting a task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Put(':id/completed')
  async markAsCompleted(@Param('id', ParseIntPipe) id: number) {
    try {
      const task: Task = await this.taskService.find(id);
      if (!task) {
        throw new NotFoundException(`The task does not exist`);
      }
      if (task.status === 'COMPLETED') {
        throw new BadRequestException(`TaskId ${id} is already marked as completed`);
      }
      task.status = 'COMPLETED';
      await this.taskService.save(task);
      return {
        success: true,
        message: 'Marked successfully',
        data: task,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Error deleting a task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTasks(@Query() paginationDto: PaginationDto) {

    try {
      const paginatedTasks: PaginationResult<Task> = await this.taskService
        .getPaginated(paginationDto.page, paginationDto.limit);
      return {
        success: true,
        data: paginatedTasks.data,
        total: paginatedTasks.total,
        page: paginatedTasks.page,
        totalPages: paginatedTasks.totalPages,
      };
    } catch (error) {
      throw new HttpException('Error retrieving tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('sorted')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSortedTasks(
    @Query() paginationDto: PaginationDto,
    @Query('order') order: 'ASC' | 'DESC'
  ) {
    try {
      const paginatedTasks = await this.taskService
        .getSortedByDate(paginationDto.page, paginationDto.limit, order);
      return {
        success: true,
        data: paginatedTasks.data,
        total: paginatedTasks.total,
        page: paginatedTasks.page,
        totalPages: paginatedTasks.totalPages,
      };
    } catch (error) {
      throw new HttpException('Error retrieving sorted and paginated tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('summary')
  async getTasksSummary() {
    try {
      const summary: SummaryTask = await this.taskService.summary();
      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      throw new HttpException('Error retrieving task summary', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
