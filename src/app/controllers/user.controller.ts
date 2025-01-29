import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Services } from '@services';
import { Types } from '@types';
import { Presenters } from '../presenters';

@Controller('user')
export class User {
    constructor(
        private readonly userService: Services.User,
        private readonly userPresenter: Presenters.User,
    ) {}

    @ApiOperation({ summary: 'Create user' })
    @ApiBody({ type: Types.EntityDTO.User.Add })
    @Post('create')
    async create(@Body() body: Types.EntityDTO.User.Add) {
        return this.userPresenter.format(await this.userService.create(body));
    }
}
