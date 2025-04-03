import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

@ApiSchema({ name: 'Transaction Create' })
export class Create {
    @ApiProperty({
        type: String,
        description: 'Customer name',
        example: 'John Doe',
    })
    @IsString()
    @MaxLength(100)
    @MinLength(5)
    customer_name!: string;

    @ApiProperty({
        type: String,
        description: 'Customer phone',
        example: '+998901234567',
    })
    @IsString()
    @MinLength(12)
    @MaxLength(13)
    customer_phone!: string;

    @ApiProperty({
        type: String,
        description: 'Transaction type',
        example: 'deposit',
        enum: ['deposit', 'withdraw', 'refund'],
    })
    @IsEnum(TransactionType)
    type!: TransactionType;
}
