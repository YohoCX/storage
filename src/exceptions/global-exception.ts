import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : 500;

        console.info(exception);

        response.status(status).send({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: (exception as any).message || 'Internal server error',
        });
    }
}
