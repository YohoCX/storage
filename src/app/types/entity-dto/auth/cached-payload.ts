import { Role } from '@prisma/client';

export type CachedPayload = {
    id: string;
    username: string;
    role: Role;
};
