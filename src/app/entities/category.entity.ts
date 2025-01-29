import { EntityState } from '@prisma/client';
import { Types } from '@types';

export class Category {
    private readonly _id: number;
    private readonly _name: string;
    private _description: string | null;
    private _state: EntityState;
    private readonly _created_at: Date;
    private _updated_at: Date | null;
    private _deleted_at: Date | null;

    constructor(dto: Types.EntityDTO.Category.Create | Types.EntityDTO.Category.Restore) {
        if (dto instanceof Types.EntityDTO.Category.Restore) {
            this._id = dto.id;
            this._created_at = dto.created_at;
            this._updated_at = dto.updated_at;
            this._deleted_at = dto.deleted_at;
        }

        this._name = dto.name;
        this._description = dto.description;
        this._state = dto.state;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string | null {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get state(): EntityState {
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

    public setUpdated() {
        this._updated_at = new Date();
    }

    public setDeleted() {
        this._deleted_at = new Date();
        this._state = 'deleted';
    }
}
