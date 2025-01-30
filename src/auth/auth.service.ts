import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Services } from '@services';
import { Types } from '@types';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { FastifyReply } from 'fastify';

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

        reply
            .setCookie('token', accessToken, {
                domain: 'api.yohocx.store', // Make sure this matches your API domain
                path: '/',
                httpOnly: true,
                secure: true, // Only works over HTTPS
                sameSite: 'none', // Required for cross-origin cookies
            })
            .send({
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

    async logout(token: string) {
        await this.cacheManager.del(token);
    }
}
