import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class Update {
    @ApiPropertyOptional({
        description: 'Product Name',
        example: 'Product Name',
        type: 'string',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'Category ID',
        example: 1,
        type: 'number',
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @IsOptional()
    category_id?: number;

    @ApiPropertyOptional({
        description: 'Product Description',
        example: 'Product Description',
        type: 'string',
    })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    description?: string;

    @ApiPropertyOptional({
        description: 'Product Type',
        example: 'continuous',
        type: 'string',
    })
    @IsEnum(ProductType)
    @IsOptional()
    type?: ProductType;
}
