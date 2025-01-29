import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class Create {
    @ApiProperty({
        description: 'Category Name, Unique',
        example: 'pipes',
        type: 'string',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional({
        description: 'Category description',
        example: 'pipes etc',
        type: 'string',
    })
    @IsString()
    @MaxLength(200)
    @IsOptional()
    description?: string;
}
