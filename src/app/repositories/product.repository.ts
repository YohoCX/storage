import { Entities } from '@entities';
import { External } from '@external';
import { Injectable } from '@nestjs/common';
import { Product as PrismaProduct } from '@prisma/client';
import { Types } from '@types';
import { NotFoundError } from 'rxjs';
import { DTOs } from '../dtos';

@Injectable()
export class Product {
    constructor(private readonly prismaService: External.Prisma.PrismaService) {}

    private mapRawToEntity(raw: PrismaProduct): Entities.Product {
        return new Entities.Product(
            new Types.EntityDTO.Product.Restore(
                raw.id,
                raw.category_id,
                raw.name,
                raw.description,
                raw.total ? Number(raw.total) : 0,
                raw.type,
                raw.state,
                raw.created_at,
                raw.updated_at,
                raw.deleted_at,
            ),
        );
    }

    public async getAllByIds(ids: number[]) {
        const raw = await this.prismaService.product.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        if (!raw.length) {
            return [];
        }

        return raw.map((r) => this.mapRawToEntity(r));
    }

    public async getAllPaginated(pagination: Types.PaginationOptions, filters: DTOs.Product.Filters) {
        const raw = await this.prismaService.product.findMany({
            where: {
                category_id: filters.categoryId,
                state: 'active',
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

        const total = await this.prismaService.product.count({
            where: {
                category_id: filters.categoryId,
                state: 'active',
            },
        });

        return {
            data: raw.map((r) => this.mapRawToEntity(r)),
            total,
        };
    }

    public async create(data: Entities.Product) {
        const raw = await this.prismaService.product.create({
            data: {
                category_id: data.category_id,
                name: data.name,
                description: data.description,
                total: data.total,
                type: data.type,
                state: 'active',
            },
        });

        return this.mapRawToEntity(raw);
    }

    public async update(data: Entities.Product) {
        const raw = await this.prismaService.product.update({
            where: {
                id: data.id,
            },
            data: {
                category_id: data.category_id,
                name: data.name,
                description: data.description,
                total: data.total,
                type: data.type,
                updated_at: new Date(),
            },
        });

        return this.mapRawToEntity(raw);
    }

    public async getById(id: number) {
        const raw = await this.prismaService.product.findUnique({
            where: {
                id,
            },
        });

        if (!raw) {
            throw new NotFoundError('Product not found');
        }

        return this.mapRawToEntity(raw);
    }

    public async delete(id: number) {
        return await this.prismaService.product.update({
            where: {
                id,
            },
            data: {
                state: 'deleted',
                deleted_at: new Date(),
            },
        });
    }

    public async updateMany(data: Entities.Product[]) {
        return await this.prismaService.product.updateMany({
            where: {
                id: {
                    in: data.map((d) => d.id),
                },
            },
            data: data,
        });
    }
}
