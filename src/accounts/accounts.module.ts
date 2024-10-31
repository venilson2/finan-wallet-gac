import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountModel } from './models/account.model';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [SequelizeModule.forFeature([AccountModel])],
  providers: [
    {
      provide: 'IAccountsService',
      useClass: AccountsService
    },
    AccountsService
  ],
  controllers: [AccountsController],
  exports: [AccountsService, 'IAccountsService'],
})
export class AccountsModule {}