import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Types } from '@types';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { token } = request.cookies;

        if (!token) {
            throw new UnauthorizedException();
        }

        const user: Types.EntityDTO.Auth.CachedPayload = JSON.parse(
            await this.cacheManager.get(token),
        );

        if (!user) {
            throw new UnauthorizedException();
        }

        const requiredRole = this.getRequiredRole(context);
        if (requiredRole.length && !requiredRole.includes(user.role)) {
            throw new ForbiddenException();
        }

        return true;
    }

    private getRequiredRole(context: ExecutionContext): Role[] {
        const handler = context.getHandler();
        return Reflect.getMetadata('roles', handler);
    }
}
