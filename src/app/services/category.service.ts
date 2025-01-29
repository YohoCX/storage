import { Entities } from '@entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repositories } from '@repositories';
import { Types } from '@types';
import { DTOs } from '../dtos';

@Injectable()
export class Category {
    constructor(private readonly categoryRepository: Repositories.Category) {}

    public async create(dto: DTOs.Category.Create) {
        const category = new Entities.Category(
            new Types.EntityDTO.Category.Create(
                dto.name,
                dto.description ? dto.description : null,
                'active',
            ),
        );

        return this.categoryRepository.create(category);
    }

    public async update(id: number, dto: DTOs.Category.Update) {
        const category = await this.categoryRepository.getById(id);

        if (dto.description) {
            category.description = dto.description;
            category.setUpdated();
        }

        return this.categoryRepository.update(category);
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
