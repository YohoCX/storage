import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Types } from '@types';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: Types.EntityDTO.Auth.Login })
    @Post('login')
    async login(@Body() body: Types.EntityDTO.Auth.Login, @Res() reply: FastifyReply) {
        return this.authService.login(body, reply);
    }
}
