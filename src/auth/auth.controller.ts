import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Types } from '@types';
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
}
