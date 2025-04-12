import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor(private readonly configService: ConfigService) {
        super({
            log: ['query', 'info', 'warn'],
        });
    }

    async onModuleInit() {
        this.logger.log('Connecting to the database...');
        await this.$connect();
        this.logger.log('Connected to the database');

        if (this.configService.get<string>('NODE_ENV') !== 'production') {
            return;
        }

        const admin = await this.user.findUnique({
            where: {
                username: 'admin',
            },
        });

        if (admin) {
            return;
        }

        const hashedPassword = await bcrypt.hash(
            this.configService.get<string>('SEED_ADMIN_PASSWORD'),
            Number(this.configService.get<number>('SALT_ROUNDS')),
        );

        await this.user.create({
            data: {
                username: 'admin',
                email: this.configService.get<string>('SEED_ADMIN_EMAIL'),
                password: hashedPassword,
                role: 'admin',
                state: 'active',
            },
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
