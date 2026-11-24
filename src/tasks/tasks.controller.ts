import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { GetAllTaskDto } from './dto/getAll-task.dto.js';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }
    
    @Get()
    findAll(@Query() dto: GetAllTaskDto) {
        return this.taskService.findAll(dto);
    }

    @Get(':id')
    findById(@Param("id", ParseIntPipe) id: number) {
        return this.taskService.findById(id);
    }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.create(createTaskDto);
    }

    @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
        return this.taskService.update(id, updateTaskDto);
    }

    @Delete(":id")
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.taskService.delete(id);
    }
}
