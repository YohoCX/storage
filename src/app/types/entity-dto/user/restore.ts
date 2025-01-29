import { EntityState, Role } from '@prisma/client';
import { Create } from './create';

export class Restore extends Create {
    private readonly _id: string;
    private readonly _created_at: Date;
    private readonly _updated_at: Date | null;
    private readonly _deleted_at: Date | null;

    public constructor(
        id: string,
        username: string,
        email: string,
        password: string,
        role: Role,
        state: EntityState,
        created_at: Date,
        updated_at: Date | null,
        deleted_at: Date | null,
    ) {
        super(username, email, password, role, state);
        this._id = id;
        this._created_at = created_at;
        this._updated_at = updated_at;
        this._deleted_at = deleted_at;
    }

    public get id() {
        return this._id;
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
}
