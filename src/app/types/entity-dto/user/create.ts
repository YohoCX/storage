import { EntityState, Role } from '@prisma/client';

export class Create {
    private readonly _username: string;
    private readonly _email: string;
    private readonly _password: string;
    private readonly _role: Role;
    private readonly _state: EntityState;

    public constructor(
        username: string,
        email: string,
        password: string,
        role: Role,
        state: EntityState = 'active',
    ) {
        this._username = username;
        this._email = email;
        this._password = password;
        this._role = role;
        this._state = state;
    }

    public get username() {
        return this._username;
    }

    public get email() {
        return this._email;
    }

    public get password() {
        return this._password;
    }

    public get role() {
        return this._role;
    }

    public get state() {
        return this._state;
    }
}
