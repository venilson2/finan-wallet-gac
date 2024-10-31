import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from './models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UsersRepository } from './users.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), AccountsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUsersService',
      useClass: UsersService
    }, 
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository
    },
    UsersService,
    UsersRepository,
  ],
  exports: [
    'IUsersRepository',
    'IUsersService',
    UsersService,
    UsersRepository
  ],
})
export class UsersModule {}
