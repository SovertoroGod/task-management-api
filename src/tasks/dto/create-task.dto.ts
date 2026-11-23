import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    title: string

    @IsOptional()
    @IsString()
    @MaxLength(366)
    description?: string
}