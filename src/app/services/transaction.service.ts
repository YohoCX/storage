import { Entities } from '@entities';
import { Injectable } from '@nestjs/common';
import { Repositories } from '@repositories';
import { Services } from '@services';
import { Types } from '@types';
import { DTOs } from '../dtos';

@Injectable()
export class Transaction {
    constructor(
        private readonly transactionService: Repositories.Transaction,
        private readonly productService: Services.Product,
    ) {}

    public async getAllPaginated(pagination: Types.PaginationOptions) {
        return this.transactionService.getAllPaginated(pagination);
    }

    public async getById(id: number) {
        return this.transactionService.getById(id);
    }

    public async performTransaction(
        data: DTOs.Transaction.Create,
        user_id: string,
        type: 'withdraw' | 'deposit' | 'refund',
    ) {
        const products = await this.productService.getAllByIds(
            data.items.map((item) => item.product_id),
        );

        for (const product of products) {
            product[type](
                data.items.find((item) => item.product_id === product.id)
                    .amount,
            );
        }

        const transaction = await this.transactionService.create(
            new Entities.Transaction(
                new Types.EntityDTO.Transaction.Create(
                    user_id,
                    data.customer_name,
                    data.customer_phone,
                    type,
                    'active',
                ),
            ),
        );

        const transactionItems = products.map((product) => {
            return {
                product_id: product.id,
                quantity: data.items.find(
                    (item) => item.product_id === product.id,
                ).amount,
                transaction_id: transaction.id,
            };
        });

        await this.transactionService.createTransactionItems(transactionItems);

        await this.productService.updateMany(products);

        return transaction;
    }
}
