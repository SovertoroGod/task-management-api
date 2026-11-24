import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { QueryUserDto } from './dto/query-user.dto.js';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    getAll(@Query() dto: QueryUserDto) {
        return this.usersService.findAll(dto);
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }
    
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Patch('id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete('id')
    delete(@Param('id', ParseIntPipe) id:number) {
        return this.usersService.delete(id);
    }
    
}
