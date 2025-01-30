import { Exceptions } from '@exceptions';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { validate } from 'class-validator';
import * as process from 'node:process';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    await app.register(import('@fastify/cookie'));
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new Exceptions.AllExceptionsFilter());

    app.enableCors({
        allowedHeaders: 'Content-Type',
        methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        origin: '*',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            validatorPackage: {
                validate,
            },
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Storage API')
        .setDescription('API Documentation for Storage API')
        .setVersion('1.0')
        .addCookieAuth('token')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
        swaggerOptions: {
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
