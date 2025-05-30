import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

@ApiSchema({ name: 'Transaction Item' })
export class TransactionProduct {
    @ApiProperty({
        type: Number,
        description: 'Product ID',
        example: 1,
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    product_id!: number;

    @ApiProperty({
        type: Number,
        description: 'Amount, decimal',
        example: 1,
    })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    amount!: number;
}
