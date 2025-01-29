import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Login {
    @ApiProperty({
        description: 'Username of the user',
        type: String,
        required: true,
        example: 'john_doe',
    })
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty({
        description: 'Password of the user',
        type: String,
        required: true,
        example: 'password',
    })
    @IsString()
    @IsNotEmpty()
    password!: string;
}
