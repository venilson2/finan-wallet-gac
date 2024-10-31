import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { TransferModel } from './models/transfer.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransfersCommand } from './commands/transfers.command';
import { TransfersRepository } from './transfers.repository';
import { LoggerService } from 'src/common/logger/logger.service';
@Module({
  imports: [SequelizeModule.forFeature([TransferModel]), AccountsModule],
  controllers: [TransfersController],
  providers: [
    {
      provide: 'ITransfersService',
      useClass: TransfersService
    },
    {
      provide: 'ITransfersCommand',
      useClass: TransfersCommand
    },
    {
      provide: 'ITransfersRepository',
      useClass: TransfersRepository
    },
    TransfersService,
    TransfersCommand,
    TransfersRepository,
    LoggerService
  ],
  exports: ['ITransfersService', 'ITransfersCommand', 'ITransfersRepository']
})
export class TransfersModule {}
