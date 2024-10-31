import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user/current-user.decorator';
import { AuthDto } from './dto/auth.dto';
import { AuthUser } from './dto/auth-user.dto';
import { IAuthService } from './interfaces/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject('IAuthService') private readonly authService: IAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() authDto: AuthDto) {
    return await this.authService.signIn(authDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: AuthUser) {
    return user;
  }
}