import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class Add {
    @ApiProperty({
        description: 'Username of the user',
        type: String,
        required: true,
        example: 'john_doe',
    })
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username!: string;

    @ApiProperty({
        description: 'Email of the user',
        type: String,
        required: true,
        example: 'email@email.com',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        description: 'Password of the user',
        type: String,
        required: true,
        example: 'password',
    })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password!: string;

    @ApiProperty({
        description: 'Role of the user',
        type: String,
        required: true,
        example: 'moderator',
    })
    @IsEnum(Role)
    role!: Role;
}
