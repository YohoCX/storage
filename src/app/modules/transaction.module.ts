import { Controllers } from '@controllers';
import { Module } from '@nestjs/common';
import { Repositories } from '@repositories';
import { Services } from '@services';
import { Presenters } from '../presenters';
import { Product } from './product.module';

@Module({
    imports: [Product],
    controllers: [Controllers.Transaction],
    providers: [Services.Transaction, Repositories.Transaction, Presenters.Transaction],
    exports: [Services.Transaction],
})
export class Transaction {}
