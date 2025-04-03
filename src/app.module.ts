import { External } from '@external';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { Modules } from '@modules';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ContextInterceptor } from './interceptors/context.interceptor';

@Module({
    imports: [
        AuthModule,
        External.Prisma.PrismaModule,
        External.MeiliSearch.MeilisearchModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                if (!configService.get<string>('REDIS_URL')) {
                    console.error('No Redis URL provided');
                    return;
                }

                const store = new Keyv({
                    store: new KeyvRedis(configService.get<string>('REDIS_URL')),
                });

                return {
                    stores: [store],
                };
            },
            inject: [ConfigService],
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
