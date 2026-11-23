import { Injectable, NotFoundException } from '@nestjs/common';
import { PrimsaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma: PrimsaService
    ) { }

    async findAll() {
        return this.prisma.task.findMany();
    }

    async findById(id: number) {
        const task = await this.prisma.task.findUnique({
            where: {
                id
            }
        });

        if (!task) {
            throw new NotFoundException(`Task with ${id} id not found`);
        }

        return task;
    }

    async create(dto: CreateTaskDto) {
        const newTask = {
            title: dto.title,
            completed: false,
            description: dto.description
        }

        await this.prisma.task.create({
            data: newTask
        });

        return newTask;
    }

    async update(id: number, dto: UpdateTaskDto) {
        const task = await this.findById(id);

        const newTask = await this.prisma.task.update({
            where: { id },
            data: {
                title: dto.title ? dto.title : task.title,
                description: dto.description ? dto.description : task.description,
                completed: dto.completed !== undefined ? dto.completed : task.completed
            }
        });

        return newTask;

    }

    async delete(id: number) {
        await this.prisma.task.delete({ where: { id } });
        return {
            message: `${id} Task deleted successfully`
        }
    }
}
