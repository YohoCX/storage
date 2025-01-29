import { Entities } from '@entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repositories } from '@repositories';
import { Types } from '@types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class User {
    private readonly saltRounds: number;

    constructor(
        private readonly userRepository: Repositories.User,
        private readonly configService: ConfigService,
    ) {
        this.saltRounds = Number(configService.get('SALT_ROUNDS'));
    }

    async create(data: Types.EntityDTO.User.Add) {
        const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

        const user = new Entities.User(
            new Types.EntityDTO.User.Create(data.username, data.email, hashedPassword, data.role),
        );

        return await this.userRepository.createUser(user);
    }

    async getByUsername(username: string) {
        return await this.userRepository.getByUsername(username);
    }
}
