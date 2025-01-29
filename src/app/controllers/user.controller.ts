import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Services } from '@services';
import { Types } from '@types';

@Controller('user')
export class User {
    constructor(private readonly userService: Services.User) {}

    @ApiOperation({ summary: 'Create user' })
    @ApiBody({ type: Types.EntityDTO.User.Add })
    @Post('create')
    async create(@Body() body: Types.EntityDTO.User.Add) {
        return this.userService.create(body);
    }
}
