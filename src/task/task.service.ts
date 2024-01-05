import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationResult } from './interface/pagination-result.interface';
import { SummaryTask } from './interface/summary.interface';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async find(id: number): Promise<Task | null> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async save(task: Task): Promise<void> {
    await this.taskRepository.save(task);
  }

  async getPaginated(page = 1, limit = 10): Promise<PaginationResult<Task>> {
    const [results, total] = await this.taskRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSortedByDate(page = 1, limit = 10, order: 'ASC' | 'DESC' = 'ASC'): Promise<PaginationResult<Task>> {
    const [results, total] = await this.taskRepository.findAndCount({
      order: {
        createdAt: order,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async summary(): Promise<SummaryTask> {
    const completed = await this.taskRepository.count({ where: { status: 'COMPLETED' } });
    const notCompleted = await this.taskRepository.count({ where: { status: 'PENDING' } });

    return {
      completed,
      notCompleted,
    };
  }
}
