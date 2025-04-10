import { Entities } from '@entities';
import { HttpException, Injectable } from '@nestjs/common';
import { EntityState } from '@prisma/client';
import { Repositories } from '@repositories';
import { Types } from '@types';
import { DTOs } from '../dtos';
import { Product } from './services';

@Injectable()
export class Transaction {
    constructor(
        private readonly transactionRepository: Repositories.Transaction,
        private readonly productService: Product,
    ) {}

    public async getAllPaginated(pagination: Types.PaginationOptions, filters: DTOs.Transaction.Filter) {
        return this.transactionRepository.getAllPaginated(pagination, filters);
    }

    public async getById(id: number) {
        return this.transactionRepository.getById(id);
    }

    public async getPendingTransaction(user_id: string) {
        const transaction = await this.transactionRepository.getPendingTransaction(user_id);

        if (!transaction) {
            throw new HttpException('Transaction not found', 404);
        }

        return transaction;
    }

    public async create(data: DTOs.Transaction.Create, user_id: string) {
        const userHasActiveTransaction = await this.transactionRepository.userHasActiveTransaction(user_id);

        if (userHasActiveTransaction) {
            throw new HttpException(
                'User has an active transaction already, to create new either complete or cancel pending transaction',
                400,
            );
        }

        return await this.transactionRepository.create(
            new Entities.Transaction(
                new Types.EntityDTO.Transaction.Create(
                    user_id,
                    data.customer_name,
                    data.customer_phone,
                    data.type,
                    'pending',
                ),
            ),
        );
    }

    public async getTransactionItems(transaction_id: number) {
        const transaction = await this.transactionRepository.getById(transaction_id);

        return await this.transactionRepository.getItemsByTransactionId(transaction.id);
    }

    public async cancelTransaction(transaction_id: number) {
        const transaction = await this.transactionRepository.getById(transaction_id);

        if (transaction.state !== 'pending') {
            throw new HttpException('Transaction is completed', 400);
        }

        await this.transactionRepository.cancelTransaction(transaction_id);
    }

    public async createCartItem(data: DTOs.Transaction.TransactionProduct, transaction_id: number) {
        const transaction = await this.transactionRepository.getById(transaction_id);
        if (transaction.state !== 'pending') {
            throw new HttpException('Transaction is completed', 400);
        }

        const existingProduct = await this.transactionRepository.getTransactionItemByProductId(
            transaction_id,
            data.product_id,
        );

        if (existingProduct) {
            throw new HttpException('Product already in cart', 400);
        }

        const product = await this.productService.getById(data.product_id);

        if (transaction.type === 'withdraw' && product.total < data.amount) {
            throw new HttpException('Not enough stock', 400);
        }

        await this.transactionRepository.createTransactionItem({
            transaction_id,
            product_id: data.product_id,
            quantity: data.amount,
        });
    }

    public async updateCartItem(data: DTOs.Transaction.TransactionProduct, transaction_id: number) {
        const transaction = await this.transactionRepository.getById(transaction_id);
        if (transaction.state !== 'pending') {
            throw new HttpException('Transaction is completed', 400);
        }

        const existingItem = await this.transactionRepository.getTransactionItemByProductId(
            transaction_id,
            data.product_id,
        );

        if (!existingItem) {
            throw new HttpException('Product not found in cart', 400);
        }

        const product = await this.productService.getById(data.product_id);

        if (transaction.type === 'withdraw' && product.total < data.amount) {
            throw new HttpException('Not enough stock', 400);
        }

        await this.transactionRepository.updateTransactionItem(existingItem.id, data.amount);
    }

    public async removeCartItem(transaction_id: number, product_id: number) {
        const transaction = await this.transactionRepository.getById(transaction_id);
        if (transaction.state !== 'pending') {
            throw new HttpException('Transaction is completed', 400);
        }

        const existingProduct = await this.transactionRepository.getTransactionItemByProductId(
            transaction_id,
            product_id,
        );

        if (!existingProduct) {
            throw new HttpException('Product not found in cart', 400);
        }

        await this.transactionRepository.removeTransactionItem(existingProduct.id);
    }

    public async finalizeCartToWithdraw(data: DTOs.Transaction.AddProducts, transaction_id: number) {
        const transaction = await this.transactionRepository.getById(transaction_id);
        if (transaction.state !== 'pending') {
            throw new HttpException('Transaction is completed', 400);
        }

        const products = await this.productService.getAllByIds(data.products.map((p) => p.product_id));
        const existingProducts = await this.transactionRepository.getItemsByTransactionId(transaction_id);

        const productsToAdd = products
            .filter((p) => {
                const existingProduct = existingProducts.find((ep) => ep.product_id === p.id);
                if (transaction.type === 'withdraw') {
                    if (p.total >= data.products.find((dp) => dp.product_id === p.id).amount) {
                        return !existingProduct;
                    }
                    throw new HttpException(`Not enough stock, product_id: ${p.id}`, 400);
                }
                return !existingProduct;
            })
            .map((p) => {
                return {
                    transaction_id,
                    product_id: p.id,
                    quantity: data.products.find((dp) => dp.product_id === p.id).amount,
                    state: 'active' satisfies EntityState,
                };
            });

        const productsToUpdate = existingProducts
            .filter((ep) => {
                return products.find((p) => p.id === ep.product_id);
            })
            .map((ep) => {
                const quantity = data.products.find((dp) => dp.product_id === ep.product_id).amount;
                if (transaction.type === 'withdraw') {
                    if (quantity > products.find((p) => p.id === ep.product_id).total) {
                        throw new HttpException(`Not enough stock, product_id: ${ep.product_id}`, 400);
                    }
                }
                return {
                    transaction_item_id: ep.id,
                    quantity,
                };
            });

        const productsToRemove = existingProducts
            .filter((ep) => {
                return !products.find((p) => p.id === ep.product_id);
            })
            .map((ep) => {
                return ep.id;
            });

        await this.transactionRepository.createTransactionItems(productsToAdd);
        await this.transactionRepository.updateTransactionItems(productsToUpdate);
        await this.transactionRepository.removeTransactionItems(productsToRemove);
    }

    public async performTransaction(transaction_id: number) {
        const transaction = await this.transactionRepository.getById(transaction_id);

        if (transaction.state !== 'pending') {
            throw new HttpException('Transaction is completed', 400);
        }

        const items = await this.transactionRepository.getItemsByTransactionId(transaction_id);

        await this.productService.updateQuantity(items, transaction.type === 'withdraw');

        await this.transactionRepository.performTransaction(transaction_id);
    }
}
