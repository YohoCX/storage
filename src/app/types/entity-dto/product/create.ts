import { EntityState, ProductType } from '@prisma/client';

export class Create {
    private readonly _category_id: number;
    private readonly _name: string;
    private readonly _description: string | null;
    private readonly _total: number | null;
    private readonly _type: ProductType;
    private readonly _state: EntityState;

    public constructor(
        category_id: number,
        name: string,
        description: string | null,
        total: number | null,
        type: ProductType,
        state: EntityState = 'active',
    ) {
        this._category_id = category_id;
        this._name = name;
        this._description = description;
        this._total = total;
        this._type = type;
        this._state = state;
    }

    public get category_id() {
        return this._category_id;
    }

    public get name() {
        return this._name;
    }

    public get description() {
        return this._description;
    }

    public get total() {
        return this._total;
    }

    public get type() {
        return this._type;
    }

    public get state() {
        return this._state;
    }
}
