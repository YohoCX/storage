import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Services } from '@services';
import { Types } from '@types';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly userService: Services.User,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.userService.getByUsername(username);

        if (user) {
            const isPasswordMatching = await bcrypt.compare(password, user.password);
            if (isPasswordMatching) {
                return user;
            }
        }

        return null;
    }

    async login(dto: Types.EntityDTO.Auth.Login, reply: FastifyReply) {
        const user = await this.validateUser(dto.username, dto.password);

        if (!user) {
            throw new UnauthorizedException();
        }

        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        const accessToken = randomUUID();

        await this.cacheManager.set(accessToken, JSON.stringify(payload), 43200000);

        console.log('Cache set:', accessToken, payload);

        reply.header('authorization', `Bearer ${accessToken}`).send({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                state: user.state,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
            access_token: accessToken,
        });
    }

    async getProfile(cached_user: Types.EntityDTO.Auth.CachedPayload) {
        return await this.userService.getByUsername(cached_user.username);
    }

    async getUser(token: string): Promise<Types.EntityDTO.Auth.CachedPayload> {
        const user: string = await this.cacheManager.get(token);
        if (!user) {
            throw new UnauthorizedException();
        }
        return JSON.parse(user);
    }

    async logout(reply: FastifyReply, req: FastifyRequest) {
        const token = req.cookies.token;

        if (!token) {
            throw new UnauthorizedException();
        }

        await this.cacheManager.del(token);

        reply.removeHeader('authorization').send('Logged out successfully');
    }
}
