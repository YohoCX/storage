import { Entities } from '@entities';
import { External } from '@external';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityState, Transaction as PrismaTransaction, TransactionStatus } from '@prisma/client';
import { Types } from '@types';
import { DTOs } from '../dtos';

@Injectable()
export class Transaction {
    constructor(private readonly prismaService: External.Prisma.PrismaService) {}

    private mapRawToEntity(raw: PrismaTransaction): Entities.Transaction {
        return new Entities.Transaction(
            new Types.EntityDTO.Transaction.Restore(
                raw.id,
                raw.user_id,
                raw.customer,
                raw.customer_phone,
                raw.type,
                raw.state,
                raw.created_at,
                raw.updated_at,
                raw.deleted_at,
            ),
        );
    }

    public async getAllPaginated(pagination: Types.PaginationOptions, filters: DTOs.Transaction.Filter) {
        const raw = await this.prismaService.transaction.findMany({
            where: {
                state: filters.status,
                type: filters.type,
            },
            skip: pagination.offset,
            take: pagination.limit,
        });

        if (!raw.length) {
            return {
                data: [],
                total: 0,
            };
        }

        const total = await this.prismaService.transaction.count();

        return {
            data: raw.map((r) => this.mapRawToEntity(r)),
            total,
        };
    }

    public async getPendingTransaction(user_id: string) {
        const transaction = await this.prismaService.transaction.findFirst({
            where: {
                user_id,
                state: 'pending' satisfies TransactionStatus,
            },
        });

        if (!transaction) {
            throw new HttpException('No pending transaction found', 204);
        }

        return this.mapRawToEntity(transaction);
    }

    public async create(data: Entities.Transaction) {
        const raw = await this.prismaService.transaction.create({
            data: {
                user_id: data.user_id,
                customer: data.customer,
                customer_phone: data.customer_phone,
                type: data.type,
                state: data.state,
            },
        });

        return this.mapRawToEntity(raw);
    }

    public async cancelTransaction(transaction_id: number) {
        const transaction = await this.prismaService.transaction.update({
            where: {
                id: transaction_id,
            },
            data: {
                state: 'failed',
                updated_at: new Date(),
            },
        });

        return this.mapRawToEntity(transaction);
    }

    public async getById(id: number) {
        const raw = await this.prismaService.transaction.findUnique({
            where: {
                id,
            },
        });

        if (!raw) {
            throw new NotFoundException('Transaction not found');
        }

        return this.mapRawToEntity(raw);
    }

    public async getItemsByTransactionId(transaction_id: number) {
        const data = await this.prismaService.transactionItems.findMany({
            where: {
                transaction_id,
                state: 'active' satisfies EntityState,
            },
            include: {
                product: {
                    select: {
                        name: true,
                        total: true,
                    },
                },
            },
        });

        if (!data.length) {
            return [];
        }

        return data.map((d) => ({
            id: d.id,
            transaction_id: d.transaction_id,
            product_id: d.product_id,
            product_total: Number(d.product.total),
            quantity: d.quantity,
            state: d.state,
            created_at: d.created_at,
            updated_at: d.updated_at,
            deleted_at: d.deleted_at,
            product_name: d.product.name,
        }));
    }

    public async userHasActiveTransaction(user_id: string) {
        return await this.prismaService.transaction.findFirst({
            where: {
                user_id,
                state: 'pending' satisfies TransactionStatus,
            },
        });
    }

    public async getTransactionItemByProductId(transaction_id: number, product_id: number) {
        return await this.prismaService.transactionItems.findFirst({
            where: {
                transaction_id,
                product_id,
                state: 'active' satisfies EntityState,
            },
        });
    }

    public async createTransactionItems(
        data: {
            transaction_id: number;
            product_id: number;
            quantity: number;
        }[],
    ) {
        await this.prismaService.transactionItems.createMany({
            data: data.map((d) => ({
                transaction_id: d.transaction_id,
                product_id: d.product_id,
                quantity: d.quantity,
                state: 'active',
            })),
        });
    }

    public async createTransactionItem(data: { transaction_id: number; product_id: number; quantity: number }) {
        await this.prismaService.transactionItems.create({
            data: {
                transaction_id: data.transaction_id,
                product_id: data.product_id,
                quantity: data.quantity,
                state: 'active',
            },
        });
    }

    public async updateTransactionItems(
        data: {
            transaction_item_id: number;
            quantity: number;
        }[],
    ) {
        await this.prismaService.$transaction(async (prisma) => {
            for (const item of data) {
                await prisma.transactionItems.update({
                    where: { id: item.transaction_item_id },
                    data: { quantity: item.quantity },
                });
            }
        });
    }

    public async updateTransactionItem(transaction_item_id: number, quantity: number) {
        const data = await this.prismaService.transactionItems.update({
            where: {
                id: transaction_item_id,
            },
            data: {
                quantity: quantity,
            },
        });

        console.log(data);
    }

    public async removeTransactionItems(transaction_item_ids: number[]) {
        await this.prismaService.transactionItems.updateMany({
            where: {
                id: {
                    in: transaction_item_ids,
                },
            },
            data: {
                state: 'deleted',
            },
        });
    }

    public async removeTransactionItem(transaction_item_id: number) {
        await this.prismaService.transactionItems.update({
            where: {
                id: transaction_item_id,
            },
            data: {
                state: 'deleted',
            },
        });
    }

    public async performTransaction(transaction_id: number) {
        const transaction = await this.prismaService.transaction.update({
            where: {
                id: transaction_id,
            },
            data: {
                state: 'completed',
                updated_at: new Date(),
            },
        });

        return this.mapRawToEntity(transaction);
    }
}
