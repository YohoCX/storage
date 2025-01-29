import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: ['query', 'info', 'warn'],
        });
    }

    async onModuleInit() {
        this.logger.log('Connecting to the database...');
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
