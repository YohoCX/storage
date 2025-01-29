import { Controllers } from '@controllers';
import { Module } from '@nestjs/common';
import { Repositories } from '@repositories';
import { Services } from '@services';
import { Presenters } from '../presenters';

@Module({
    imports: [],
    controllers: [Controllers.Product],
    providers: [Services.Product, Repositories.Product, Presenters.Product],
    exports: [Services.Product],
})
export class Product {}
