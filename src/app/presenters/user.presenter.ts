import { Entities } from '@entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class User {
    public format(entity: Entities.User) {
        return {
            id: entity.id,
            username: entity.username,
            email: entity.email,
            role: entity.role,
            state: entity.state,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            deleted_at: entity.deleted_at,
        };
    }

    public formatMany(entities: Entities.User[]) {
        return { data: entities.map((entity) => this.format(entity)) };
    }

    public formatPaginated(entities: Entities.User[], total: number) {
        return { data: entities.map((entity) => this.format(entity)), total };
    }
}
