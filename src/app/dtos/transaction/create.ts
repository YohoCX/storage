import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsString, MaxLength, MinLength } from 'class-validator';
import { Item } from './item';

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
        type: [Item],
        description: 'Items',
        example: [{ product_id: 1, amount: 1 }],
    })
    @IsObject({ each: true })
    @Type(() => Item)
    items: Item[];
}
