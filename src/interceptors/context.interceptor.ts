import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Inject,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export class ContextInterceptor implements NestInterceptor {
    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request: FastifyRequest = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ').pop();
        try {
            request['user'] = await this.authService.getUser(token);
        } catch (error) {
            if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
                return next.handle();
            } else {
                throw error;
            }
        }

        // Pass the request along to the next handler (e.g., next interceptor or route handler)
        return next.handle();
    }
}
