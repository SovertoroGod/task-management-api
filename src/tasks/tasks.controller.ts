import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }
    
    @Get()
    findAll() {
        return this.taskService.findAll();
    }

    @Get(':id')
    findById(@Param("id", ParseIntPipe) id: number) {
        return this.taskService.findById(id);
    }

    @Post()
    create(@Body('title') createTaskDto: CreateTaskDto) {
        return this.taskService.create(createTaskDto.title);
    }

    @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
        return this.taskService.update(id, updateTaskDto.title, updateTaskDto.completed);
    }

    @Delete(":id")
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.taskService.delete(id);
    }
}
