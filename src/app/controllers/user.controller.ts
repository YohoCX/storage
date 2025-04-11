import { Decorators } from '@decorators';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Services } from '@services';
import { Types } from '@types';
import { AuthGuard } from '../../auth/auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { Presenters } from '../presenters';

@Controller('user')
@UseGuards(AuthGuard)
export class User {
    constructor(
        private readonly userService: Services.User,
        private readonly userPresenter: Presenters.User,
    ) {}

    @Roles('admin')
    @ApiOperation({ summary: 'Create user' })
    @ApiBody({ type: Types.EntityDTO.User.Add })
    @Post('create')
    async create(@Body() body: Types.EntityDTO.User.Add) {
        return this.userPresenter.format(await this.userService.create(body));
    }

    @ApiOperation({ summary: 'Get Self' })
    @Get('me')
    async getSelf(@Decorators.CurrentUser() user: Types.EntityDTO.Auth.CachedPayload) {
        return this.userPresenter.format(await this.userService.getByUsername(user.username));
    }
}
