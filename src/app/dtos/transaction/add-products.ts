import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { TransactionProduct } from './transaction-product';

export class AddProducts {
    @ApiProperty({
        type: TransactionProduct,
        description: 'Products to add',
        example: [
            {
                product_id: 1,
                amount: 1,
            },
        ],
    })
    @IsArray()
    products!: TransactionProduct[];
}
