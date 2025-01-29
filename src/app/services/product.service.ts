import { Entities } from '@entities';
import { Injectable } from '@nestjs/common';
import { Repositories } from '@repositories';
import { Types } from '@types';
import { DTOs } from '../dtos';

@Injectable()
export class Product {
    constructor(private readonly productRepository: Repositories.Product) {}

    public async getAllPaginated(pagination: Types.PaginationOptions, filters: DTOs.Product.Filters) {
        return this.productRepository.getAllPaginated(pagination, filters);
    }

    public async getById(id: number) {
        return this.productRepository.getById(id);
    }

    public async getAllByIds(ids: number[]) {
        return this.productRepository.getAllByIds(ids);
    }

    public async delete(id: number) {
        const product = await this.getById(id);
        return this.productRepository.delete(product.id);
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

        return this.productRepository.create(product);
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

        return this.productRepository.update(product);
    }

    public async updateMany(entities: Entities.Product[]) {
        return this.productRepository.updateMany(entities);
    }
}
