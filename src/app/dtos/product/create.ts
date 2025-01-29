import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class Create {
    @ApiProperty({
        description: 'Product Name',
        example: 'Product Name',
        type: 'string',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name!: string;

    @ApiProperty({
        description: 'Category ID',
        example: 1,
        type: 'number',
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    category_id!: number;

    @ApiPropertyOptional({
        description: 'Product Description',
        example: 'Product Description',
        type: 'string',
    })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    description?: string;

    @ApiProperty({
        description: 'Product Type',
        example: 'continuous',
        type: 'string',
    })
    @IsEnum(ProductType)
    type!: ProductType;
}
