import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { QueryUserDto } from './dto/query-user.dto.js';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findAll(dto: QueryUserDto) {
        const page = dto.page || 1;
        const limit = dto.limit || 10;
        const skip = (page - 1) * limit;

        const where = {
            ...(dto.search && {
                name: {
                    contains: dto.search,
                    mode: "insensitive" as const
                }
            }),
        }

        const orderBy =
            dto.sortType === "name"
                ? { name: (dto.sortOrder ?? "desc") as "asc" | "desc" }
                : { createdAt: (dto.sortOrder ?? "desc") as "asc" | "desc" };
        
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                orderBy,
                skip,
                take: limit
            }),
            this.prisma.user.count({
                where
            })
        ]);

        return {
            data,
            metadata: {
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit)
            }
        }
    }

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException(`User with ${id} not found`);
        };

        return user;
    };

    async create(dto: CreateUserDto) {

        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
            }
        });

        return newUser;
    };

    async update(id: number, dto: UpdateUserDto) {
        await this.findById(id);

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.email && { email: dto.email }),
            }
        });

        return updatedUser;
    }

    async delete(id: number){
        await this.findById(id);

        await this.prisma.user.delete({
            where: { id }
        });

        return {
            message: `${id} user deleted successfully`
        }
    }

}
