import { IsBoolean, IsDate, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

export class GetAllTaskDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;
    
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Transform(({ value }) =>
        value === 'true' ? true :
            value === 'false' ? false : value
    )
    @IsBoolean()
    completed?: boolean;
    
    @IsOptional()
    @IsString()
    @MaxLength(255)
    search?: string;

    @IsOptional()
    @IsIn(["title", "createdAt"])
    sortType?: string;

    @IsOptional()
    @IsIn(["asc", "desc"])
    sortOrder?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        const [day, month, year] = value.split('-').map(Number);
        // Return invalid date if format doesn't match so @IsDate catches it
        if (!day || !month || !year) return new Date('invalid');
        return new Date(year, month - 1, day);
    })
    @IsDate()
    date?: Date;
}