import { Entities } from '@entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Transaction {
    public format(entity: Entities.Transaction) {
        return {
            id: entity.id,
            user_id: entity.user_id,
            customer: entity.customer,
            customer_phone: entity.customer_phone,
            type: entity.type,
            state: entity.state,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            deleted_at: entity.deleted_at,
        };
    }

    public formatMany(entities: Entities.Transaction[]) {
        return { data: entities.map((entity) => this.format(entity)) };
    }
}
