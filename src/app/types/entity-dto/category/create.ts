import { EntityState } from '@prisma/client';

export class Create {
    private readonly _name: string;
    private readonly _description: string | null;
    private readonly _state: EntityState;

    public constructor(name: string, description: string | null, entityState: EntityState) {
        this._name = name;
        this._description = description;
        this._state = entityState;
    }

    public get name() {
        return this._name;
    }

    public get description() {
        return this._description;
    }

    public get state() {
        return this._state;
    }
}
