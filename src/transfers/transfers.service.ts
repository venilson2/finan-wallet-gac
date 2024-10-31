import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferEntity } from './entities/transfer.entity';
import { AuthUser } from 'src/auth/dto/auth-user.dto';
import { ITransfersService } from './interfaces/transfers.service.interface';
import { ITransfersRepository } from './interfaces/transfers.repository.interface';
import { ITransfersCommand } from './interfaces/transfers-command.interface';
import { IAccountsService } from 'src/accounts/interfaces/accounts.service.interface';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class TransfersService implements ITransfersService {
  constructor(
    private sequelize: Sequelize,
    @Inject('IAccountsService') private accountsService: IAccountsService,
    @Inject('ITransfersCommand') private transfersCommand: ITransfersCommand,
    @Inject('ITransfersRepository') private transfersRepository: ITransfersRepository,
    private logger: LoggerService,
  ) {}

  async transfer(createTransferDto: CreateTransferDto, user: AuthUser): Promise<string> {
    const transaction = await this.sequelize.transaction();

    try {

      const { senderAccount, receiverAccount } =  await this.accountsService.getAccounts(
        user.account.id, createTransferDto.receiver_account_id
      );

      this.transfersCommand.configure(senderAccount, receiverAccount, createTransferDto.amount);
      
      this.transfersCommand.validate();
      this.transfersCommand.execute();

      await this.accountsService.updateBalances([senderAccount, receiverAccount], transaction);

      const transfer = new TransferEntity({
        senderId: user.id,
        receiverId: receiverAccount.userId,
        amount: +createTransferDto.amount,
        status: 'completed'
      })

      await this.transfersRepository.create(transfer, transaction);

      await transaction.commit();
      this.logger.info(`Transfer completed: ${JSON.stringify(transfer)}`);
      return 'Transfer completed successfully';
    } catch (error) {
      this.logger.error('Error during transfer', error.stack);
      await transaction.rollback();
      throw error;
    }
  }

  async reverseTransfer(transferId: string, user: AuthUser) {
    const transaction = await this.sequelize.transaction();

    try {
      const transfer = await this.transfersRepository.findOne(transferId, user.id, transaction);

      if(!transfer) {
        throw new BadRequestException('The specified transfer does not exist');
      }

      if (transfer.status === 'reversed') {
        throw new BadRequestException('Transfer has already been reversed.');
      }

      const senderAccount = await this.accountsService.findOne(user.account.id);
      const receiverAccount = await this.accountsService.findOneByUser(transfer.receiverId);

      this.transfersCommand.configure(senderAccount, receiverAccount, +transfer.amount);
      this.transfersCommand.undo();

      await this.accountsService.updateBalances([senderAccount, receiverAccount], transaction);

      const reversedTransfer = new TransferEntity({
        senderId: transfer.senderId,
        receiverId: transfer.receiverId,
        amount: +transfer.amount,
        status: 'completed',
        originalTransferId: transfer.id
      })

      await this.transfersRepository.create(reversedTransfer, transaction);
      await this.transfersRepository.updateStatus(transfer.id, 'reversed', transaction);
      
      await transaction.commit();

      this.logger.info(`Transfer reversed successfully: ${JSON.stringify(reversedTransfer)}`);
      return 'Transfer reversed successfully';
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error during reverse transfer', error.stack);
      throw error;
    }
  }
}