import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class Pagination {
    @ApiProperty({
        description: 'Page number',
        example: 1,
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    page!: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10,
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit!: number;

    get offset(): number {
        return (this.page - 1) * this.limit;
    }

    public get paginationOptions() {
        return {
            offset: this.offset,
            limit: this.limit,
        };
    }
}
