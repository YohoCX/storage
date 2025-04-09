import { Entities } from '@entities';
import { Injectable } from '@nestjs/common';
import { Repositories } from '@repositories';
import { Types } from '@types';
import { DTOs } from '../dtos';
import { External } from '@external';

@Injectable()
export class Product {
    constructor(
        private readonly productRepository: Repositories.Product,
        private readonly searchService: External.MeiliSearch.MeilisearchService,
    ) {}

    public async getAllPaginated(pagination: Types.PaginationOptions, filters: DTOs.Product.Filters) {
        return this.productRepository.getAllPaginated(pagination, filters);
    }

    public async getById(id: number) {
        return this.productRepository.getById(id);
    }

    public async search(query: string) {
        return this.searchService.searchIndex('products', query);
    }

    public async getAllByIds(ids: number[]) {
        return this.productRepository.getAllByIds(ids);
    }

    public async delete(id: number) {
        const product = await this.getById(id);
        await this.productRepository.delete(product.id);
        await this.searchService.deleteDocument('products', product.id.toString());
    }

    public async create(dto: DTOs.Product.Create) {
        const product = new Entities.Product(
            new Types.EntityDTO.Product.Create(
                dto.category_id,
                dto.name,
                dto.description ? dto.description : null,
                null,
                dto.type,
                'active',
            ),
        );

        const created = await this.productRepository.create(product);
        await this.searchService.addDocument('products', {
            id: created.id,
            name: created.name,
            category_id: created.category_id,
            description: created.description,
            type: created.type,
            state: created.state,
            created_at: created.created_at,
            updated_at: created.updated_at,
            deleted_at: created.deleted_at,
        });
        return created;
    }

    public async update(id: number, dto: DTOs.Product.Update) {
        const product = await this.productRepository.getById(id);

        if (dto.name) {
            product.name = dto.name;
        }

        if (dto.category_id) {
            product.category_id = dto.category_id;
        }

        if (dto.description) {
            product.description = dto.description;
        }

        if (dto.type) {
            product.type = dto.type;
        }

        if (dto.name || dto.category_id || dto.description || dto.type) {
            product.setUpdated();
        }

        const updated = await this.productRepository.update(product);
        await this.searchService.updateDocument(
            'products',
            {
                id: updated.id,
                name: updated.name,
                category_id: updated.category_id,
                description: updated.description,
                type: updated.type,
                state: updated.state,
                created_at: updated.created_at,
                updated_at: updated.updated_at,
                deleted_at: updated.deleted_at,
            },
            updated.id.toString(),
        );
        return updated;
    }

    public async updateQuantity(items_to_update: { id: number; quantity: number }[], withdraw: boolean) {
        const products = await this.productRepository.getAllByIds(items_to_update.map((item) => item.id));

        const updated = products.map((product) => {
            const item = items_to_update.find((item) => item.id === product.id);
            if (item) {
                product.total = product.total - (withdraw ? item.quantity : -item.quantity);
                product.setUpdated();
            }
            return product;
        });

        await this.productRepository.updateManyQuantity(
            updated.map((product) => ({
                id: product.id,
                total: product.total,
            })),
        );
    }
}
