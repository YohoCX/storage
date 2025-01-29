import { EntityState, ProductType } from '@prisma/client';
import { Types } from '@types';

export class Product {
    private readonly _id: number;
    private _category_id: number;
    private _name: string;
    private _description: string | null;
    private _total: number | null;
    private _type: ProductType;
    private _state: EntityState;
    private readonly _created_at: Date;
    private _updated_at: Date | null;
    private _deleted_at: Date | null;

    public constructor(dto: Types.EntityDTO.Product.Create | Types.EntityDTO.Product.Restore) {
        if (dto instanceof Types.EntityDTO.Product.Restore) {
            this._id = dto.id;
            this._created_at = dto.created_at;
            this._updated_at = dto.updated_at;
            this._deleted_at = dto.deleted_at;
        }
        this._category_id = dto.category_id;
        this._name = dto.name;
        this._description = dto.description;
        this._total = dto.total;
        this._type = dto.type;
        this._state = dto.state;
    }

    public get id() {
        return this._id;
    }

    public get category_id() {
        return this._category_id;
    }

    public set category_id(value: number) {
        this._category_id = value;
    }

    public get name() {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get description() {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get total() {
        return this._total;
    }

    public set total(value: number) {
        this._total = value;
    }

    public get type() {
        return this._type;
    }

    public set type(value: ProductType) {
        this._type = value;
    }

    public get state() {
        return this._state;
    }

    public set state(value: EntityState) {
        this._state = value;
    }

    public get created_at() {
        return this._created_at;
    }

    public get updated_at() {
        return this._updated_at;
    }

    public get deleted_at() {
        return this._deleted_at;
    }

    public setUpdated() {
        this._updated_at = new Date();
    }

    public setDeleted() {
        this._deleted_at = new Date();
    }

    public withdraw(amount: number) {
        if (this._total < amount) {
            throw new Error('Insufficient funds');
        }

        this._total = this._total - amount;
    }

    public deposit(amount: number) {
        this._total = this._total + amount;
    }

    public refund(amount: number) {
        this._total = this._total + amount;
    }
}
