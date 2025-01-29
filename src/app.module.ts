import { External } from '@external';
import { Modules } from '@modules';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ContextInterceptor } from './interceptors/context.interceptor';

@Module({
    imports: [
        AuthModule,
        External.Prisma.PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        CacheModule.register({
            isGlobal: true,
        }),
        Modules.Category,
        Modules.Product,
        Modules.Transaction,
        Modules.User,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ContextInterceptor,
        },
    ],
})
export class AppModule {}
