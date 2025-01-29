import { Entities } from '@entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Category {
    public format(entity: Entities.Category) {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            state: entity.state,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            deleted_at: entity.deleted_at,
        };
    }

    public formatMany(entities: Entities.Category[]) {
        return { data: entities.map((entity) => this.format(entity)) };
    }
}
