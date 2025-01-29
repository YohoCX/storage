import { Entities } from '@entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Product {
    public format(entity: Entities.Product) {
        return {
            id: entity.id,
            category_id: entity.category_id,
            name: entity.name,
            description: entity.description,
            total: entity.total,
            type: entity.type,
            state: entity.state,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            deleted_at: entity.deleted_at,
        };
    }

    public formatMany(entities: Entities.Product[]) {
        return { data: entities.map((entity) => this.format(entity)) };
    }
}
