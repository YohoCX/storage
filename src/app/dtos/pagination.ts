import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class Pagination {
    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    @Transform(({ value }) => (value ? Number(value) : 1))
    public page: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page', example: 10, default: 10 })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @IsOptional()
    @Max(50)
    @Transform(({ value }) => (value ? Number(value) : 10))
    public limit: number = 10;

    public get options() {
        return {
            offset: (this.page - 1) * this.limit,
            limit: this.limit,
        };
    }
}
