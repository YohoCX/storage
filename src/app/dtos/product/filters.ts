import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

@ApiSchema({ name: 'Product Filters' })
export class Filters {
    @ApiPropertyOptional({
        description: 'Category Id',
        example: 1,
        type: 'number',
    })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    public categoryId?: number;

    @ApiPropertyOptional({
        description: 'Transaction Id',
        example: 1,
        type: 'number',
    })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    public transactionId?: number;
}
