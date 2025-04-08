import { TransactionStatus, TransactionType } from '@prisma/client';
import { Types } from '@types';

export class Transaction {
    private readonly _id: number;
    private readonly _user_id: string;
    private readonly _customer: string;
    private readonly _customer_phone: string;
    private readonly _type: TransactionType;
    private readonly _state: TransactionStatus;
    private readonly _created_at: Date;
    private readonly _updated_at: Date | null;
    private readonly _deleted_at: Date | null;

    public constructor(dto: Types.EntityDTO.Transaction.Create | Types.EntityDTO.Transaction.Restore) {
        if (dto instanceof Types.EntityDTO.Transaction.Restore) {
            this._id = dto.id;
            this._created_at = dto.created_at;
            this._updated_at = dto.updated_at;
            this._deleted_at = dto.deleted_at;
        }

        this._user_id = dto.user_id;
        this._customer = dto.customer;
        this._customer_phone = dto.customer_phone;
        this._type = dto.type;
        this._state = dto.state;
    }

    public get id(): number {
        return this._id;
    }

    public get user_id(): string {
        return this._user_id;
    }

    public get customer(): string {
        return this._customer;
    }

    public get customer_phone(): string {
        return this._customer_phone;
    }

    public get type(): TransactionType {
        return this._type;
    }

    public get state(): TransactionStatus {
        return this._state;
    }

    public get created_at(): Date {
        return this._created_at;
    }

    public get updated_at(): Date | null {
        return this._updated_at;
    }

    public get deleted_at(): Date | null {
        return this._deleted_at;
    }
}
