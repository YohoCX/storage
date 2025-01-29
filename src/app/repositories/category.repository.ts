import { Entities } from '@entities';
import { External } from '@external';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Category as PrismaCategory } from '@prisma/client';
import { Types } from '@types';

@Injectable()
export class Category {
    constructor(private prismaService: External.Prisma.PrismaService) {}

    private mapRawToEntity(raw: PrismaCategory): Entities.Category {
        return new Entities.Category(
            new Types.EntityDTO.Category.Restore(
                raw.id,
                raw.name,
                raw.description,
                raw.state,
                raw.created_at,
                raw.updated_at,
                raw.deleted_at,
            ),
        );
    }

    async getAllPaginated(pagination: Types.PaginationOptions) {
        const raw = await this.prismaService.category.findMany({
            where: {
                state: 'active',
            },
            skip: pagination.offset,
            take: pagination.limit,
        });

        if (!raw.length) {
            return {
                categories: [],
                total: 0,
            };
        }

        const total = await this.prismaService.category.count({
            where: {
                state: 'active',
            },
        });

        return {
            categories: raw.map((r) => this.mapRawToEntity(r)),
            total,
        };
    }

    async create(entity: Entities.Category) {
        const raw = await this.prismaService.category.create({
            data: {
                name: entity.name,
                description: entity.description,
                state: 'active',
            },
        });

        return this.mapRawToEntity(raw);
    }

    async update(entity: Entities.Category) {
        const raw = await this.prismaService.category.update({
            where: {
                id: entity.id,
            },
            data: {
                name: entity.name,
                description: entity.description,
            },
        });

        return this.mapRawToEntity(raw);
    }

    async getById(id: number) {
        const raw = await this.prismaService.category.findUnique({
            where: {
                id,
            },
        });

        if (!raw) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }

        return this.mapRawToEntity(raw);
    }

    async delete(id: number) {
        await this.prismaService.category.update({
            where: {
                id,
            },
            data: {
                state: 'deleted',
                deleted_at: new Date(),
            },
        });
    }
}
