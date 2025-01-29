import { Entities } from '@entities';
import { External } from '@external';
import { Injectable } from '@nestjs/common';
import { Transaction as PrismaTransaction } from '@prisma/client';
import { Types } from '@types';

@Injectable()
export class Transaction {
    constructor(
        private readonly prismaService: External.Prisma.PrismaService,
    ) {}

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

    public async getAllPaginated(pagination: Types.PaginationOptions) {
        const raw = await this.prismaService.transaction.findMany({
            skip: pagination.offset,
            take: pagination.limit,
        });

        if (!raw.length) {
            return [];
        }

        return raw.map((r) => this.mapRawToEntity(r));
    }

    public async createTransactionItems(
        data: {
            transaction_id: number;
            product_id: number;
            quantity: number;
        }[],
    ) {
        await this.prismaService.transactionItems.createMany({
            data: data,
        });
    }

    public async create(data: Entities.Transaction) {
        const raw = await this.prismaService.transaction.create({
            data: data,
        });

        return this.mapRawToEntity(raw);
    }

    public async update(data: Entities.Transaction) {
        const raw = await this.prismaService.transaction.update({
            where: {
                id: data.id,
            },
            data: data,
        });

        return this.mapRawToEntity(raw);
    }

    public async delete(id: number) {
        await this.prismaService.transaction.update({
            where: {
                id,
            },
            data: {
                state: 'deleted',
                deleted_at: new Date(),
            },
        });
    }

    public async getById(id: number) {
        const raw = await this.prismaService.transaction.findUnique({
            where: {
                id,
            },
        });

        if (!raw) {
            throw new Error('Transaction not found');
        }

        return this.mapRawToEntity(raw);
    }
}
