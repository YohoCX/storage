import { Entities } from '@entities';
import { External } from '@external';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { Types } from '@types';

@Injectable()
export class User {
    constructor(private prismaService: External.Prisma.PrismaService) {}

    private mapRawToEntity(raw: PrismaUser) {
        return new Entities.User(
            new Types.EntityDTO.User.Restore(
                raw.id,
                raw.username,
                raw.email,
                raw.password,
                raw.role,
                raw.state,
                raw.created_at,
                raw.updated_at,
                raw.deleted_at,
            ),
        );
    }

    async createUser(data: Entities.User) {
        const raw = await this.prismaService.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role,
                state: 'active',
            },
        });

        return this.mapRawToEntity(raw);
    }

    async getByUsername(username: string) {
        const raw = await this.prismaService.user.findUnique({
            where: {
                username,
            },
        });

        if (!raw) {
            throw new NotFoundException('User not found');
        }

        return this.mapRawToEntity(raw);
    }
}
