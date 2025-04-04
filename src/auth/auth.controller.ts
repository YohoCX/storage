import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Types } from '@types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from './auth.guard';
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

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Logout' })
    @Post('logout')
    async logout(@Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        return this.authService.logout(reply, req);
    }
}
