import { Controllers } from '@controllers';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Repositories } from '@repositories';
import { Services } from '@services';

@Module({
    imports: [ConfigModule],
    controllers: [Controllers.User],
    providers: [Services.User, Repositories.User],
    exports: [Services.User],
})
export class User {}
