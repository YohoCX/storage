import { Controllers } from '@controllers';
import { Module } from '@nestjs/common';
import { Repositories } from '@repositories';
import { Services } from '@services';

@Module({
    imports: [],
    controllers: [Controllers.Product],
    providers: [Services.Product, Repositories.Product],
    exports: [Services.Product],
})
export class Product {}
