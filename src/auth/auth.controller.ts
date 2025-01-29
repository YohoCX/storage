import { Decorators } from '@decorators';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Types } from '@types';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: Types.EntityDTO.Auth.Login })
    @Post('login')
    async login(@Body() body: Types.EntityDTO.Auth.Login) {
        return this.authService.login(body);
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get profile' })
    @Get('profile')
    async getProfile(@Decorators.CurrentUser() user: Types.EntityDTO.Auth.CachedPayload) {
        return this.authService.getProfile(user);
    }
}
