import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';
import { MeilisearchService } from './meili.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'MEILISEARCH_CLIENT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new MeiliSearch({
                    host: configService.get<string>('MEILI_HOST'),
                });
            },
        },
        MeilisearchService,
    ],
    exports: ['MEILISEARCH_CLIENT', MeilisearchService],
})
export class MeilisearchModule {}
