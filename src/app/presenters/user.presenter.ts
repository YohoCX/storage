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
}
