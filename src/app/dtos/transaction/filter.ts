import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

@ApiSchema({ name: 'Transaction Filter' })
export class Filter {
    @ApiPropertyOptional({
        description: 'Transaction Type',
        type: 'string',
        example: 'deposit',
    })
    @IsEnum(TransactionType)
    @IsOptional()
    type?: TransactionType;

    @ApiPropertyOptional({
        description: 'Transaction State',
        type: 'string',
        example: 'completed',
    })
    @IsEnum(TransactionStatus)
    @IsOptional()
    status?: TransactionStatus;
}
