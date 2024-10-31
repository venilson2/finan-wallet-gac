import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/auth.service.interface';
import { IUsersService } from 'src/users/interfaces/users.service.interface';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class AuthService implements IAuthService  {
  constructor(
    private jwtService: JwtService,
    @Inject('IUsersService') private readonly usersService: IUsersService,
    private logger: LoggerService
  ) {}

  async signIn(userDTO: AuthDto): Promise<AuthResponseDto> {

    try {
      const user = await this.usersService.findOneByEmail(userDTO.email);

      if (!user){
        this.logger.warn(`User not found: ${userDTO.email}`);
        throw new NotFoundException('User not found');
      }

      const passwordMatch = await bcrypt.compare(userDTO.password, user.password);

      if (!passwordMatch){
        this.logger.warn(`Invalid credentials for user: ${userDTO.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { 
        id: user.id, 
        name: user.name,
        email: user.email,
        account: {
          id: user.account.id,
          balance: +user.account.balance,
        }
      };
      this.logger.info(`User signed in successfully: ${userDTO.email}`);
      const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          account: {
            id: user.account.id,
            balance: +user.account.balance,
          }
        },
        expires_in: 3600
      };
    } catch (error) {
      this.logger.error(`Error during sign-in for user: ${userDTO.email}`, error.stack);
      throw new Error(error); 
    }
  }
}