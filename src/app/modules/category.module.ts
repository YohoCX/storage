import { Controllers } from '@controllers';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Repositories } from '@repositories';
import { Services } from '@services';
import { Presenters } from '../presenters';

@Module({
    imports: [ConfigModule],
    controllers: [Controllers.Category],
    providers: [Services.Category, Repositories.Category, Presenters.Category],
    exports: [Services.Category],
})
export class Category {}
