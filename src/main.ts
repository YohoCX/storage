import { Exceptions } from '@exceptions';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    await app.register(import('@fastify/cookie'));
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new Exceptions.AllExceptionsFilter());

    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
