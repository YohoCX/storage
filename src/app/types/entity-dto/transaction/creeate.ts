import { EntityState, TransactionType } from '@prisma/client';

export class Create {
    private readonly _user_id: string;
    private readonly _customer: string;
    private readonly _customer_phone: string;
    private readonly _type: TransactionType;
    private readonly _state: EntityState;

    constructor(user_id: string, customer: string, customer_phone: string, type: TransactionType, state: EntityState) {
        this._user_id = user_id;
        this._customer = customer;
        this._customer_phone = customer_phone;
        this._type = type;
        this._state = state;
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

    public get state(): EntityState {
        return this._state;
    }
}
