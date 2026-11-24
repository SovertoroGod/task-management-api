import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { GetAllTaskDto } from './dto/getAll-task.dto.js';

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findAll(dto: GetAllTaskDto) {

        const page = dto.page ?? 1;
        const limit = dto.limit ?? 10;
        const skip = (page - 1) * limit;

        const startDate = dto.date ? new Date(dto.date) : undefined;
        if (startDate) startDate.setHours(0, 0, 0, 0);

        const endDate = dto.date ? new Date(dto.date) : undefined;
        if (endDate) endDate.setHours(23, 59, 59, 999);

        const where = {
            ...(dto.completed !== undefined && {
                completed: dto.completed
            }),
            ...(dto.search && {
                title: {
                    contains: dto.search,
                    mode: "insensitive" as const,
                }
            }),
            ...(dto.date && {
                createdAt: {
                    gte: startDate!,
                    lte: endDate!
                }
            })
        };

        const orderBy =
            dto.sortType === "title"
                ? { title: (dto.sortOrder ?? 'desc') as 'asc' | 'desc' }
                : { createdAt: (dto.sortOrder ?? 'desc') as 'asc' | 'desc' };

        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                orderBy,
                skip,
                take: limit
            }),
            this.prisma.task.count({
                where
            })
        ]);

        return {
            data: tasks,
            metadata: {
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit)
            }
        };
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
        const data = {
            title: dto.title,
            completed: false,
            description: dto.description
        }

        const newTask = await this.prisma.task.create({
            data
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
        await this.findById(id);
        await this.prisma.task.delete({ where: { id } });
        return {
            message: `${id} Task deleted successfully`
        }
    }
}
