import { EntityState, Role } from '@prisma/client';
import { Types } from '@types';

export class User {
    private readonly _id: string;
    private readonly _email: string;
    private readonly _username: string;
    private readonly _password: string;
    private readonly _role: Role;

    private readonly _state: EntityState;
    private readonly _created_at: Date;
    private readonly _updated_at: Date | null;
    private readonly _deleted_at: Date | null;

    constructor(
        dto: Types.EntityDTO.User.Create | Types.EntityDTO.User.Restore,
    ) {
        if (dto instanceof Types.EntityDTO.User.Restore) {
            this._id = dto.id;
            this._created_at = dto.created_at;
            this._updated_at = dto.updated_at;
            this._deleted_at = dto.deleted_at;
        }
        this._email = dto.email;
        this._username = dto.username;
        this._password = dto.password;
        this._role = dto.role;
    }

    get id() {
        return this._id;
    }

    get email() {
        return this._email;
    }

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }

    get role() {
        return this._role;
    }

    get state() {
        return this._state;
    }

    get created_at() {
        return this._created_at;
    }

    get updated_at() {
        return this._updated_at;
    }

    get deleted_at() {
        return this._deleted_at;
    }
}
