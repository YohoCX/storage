import { Controllers } from '@controllers';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Repositories } from '@repositories';
import { Services } from '@services';

@Module({
    imports: [ConfigModule],
    controllers: [Controllers.Category],
    providers: [Services.Category, Repositories.Category],
    exports: [Services.Category],
})
export class Category {}
