import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

@ApiSchema({ name: 'Category Update' })
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
