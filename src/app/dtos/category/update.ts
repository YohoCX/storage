import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class Update {
    @ApiProperty({
        description: 'Category description',
        example: 'pipes etc',
        type: 'string',
    })
    @IsString()
    @MaxLength(200)
    description!: string;
}
