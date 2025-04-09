import { Entities } from '@entities';
import { External } from '@external';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repositories } from '@repositories';
import { Types } from '@types';
import { DTOs } from '../dtos';

@Injectable()
export class Category {
    constructor(
        private readonly categoryRepository: Repositories.Category,
        private readonly searchService: External.MeiliSearch.MeilisearchService,
    ) {}

    public async search(query: string) {
        return this.searchService.searchIndex('categories', query);
    }

    public async create(dto: DTOs.Category.Create) {
        const category = new Entities.Category(
            new Types.EntityDTO.Category.Create(dto.name, dto.description ? dto.description : null, 'active'),
        );

        const created = await this.categoryRepository.create(category);
        await this.searchService.addDocument('categories', {
            id: created.id,
            name: created.name,
            description: created.description,
            state: created.state,
            created_at: created.created_at,
            updated_at: created.updated_at,
            deleted_at: created.deleted_at,
        });
        return created;
    }

    public async update(id: number, dto: DTOs.Category.Update) {
        const category = await this.categoryRepository.getById(id);

        if (dto.description) {
            category.description = dto.description;
            category.setUpdated();
        }

        const updated = await this.categoryRepository.update(category);

        await this.searchService.updateDocument(
            'categories',
            {
                id: updated.id,
                name: updated.name,
                description: updated.description,
                state: updated.state,
                created_at: updated.created_at,
                updated_at: updated.updated_at,
                deleted_at: updated.deleted_at,
            },
            updated.id.toString(),
        );

        return updated;
    }

    public async getById(id: number) {
        return this.categoryRepository.getById(id);
    }

    public async getAllPaginated(pagination: Types.PaginationOptions) {
        return this.categoryRepository.getAllPaginated(pagination);
    }

    public async delete(id: number) {
        const category = await this.getById(id);
        if (category.state !== 'active') {
            throw new BadRequestException({
                message: 'category is already deleted',
            });
        }
        return this.categoryRepository.delete(category.id);
    }
}
