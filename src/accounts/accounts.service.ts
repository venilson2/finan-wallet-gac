import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountModel } from './models/account.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { AccountEntity } from './entities/account.entity';
import { ResponseAccontDto } from './dto/reponse-account.dto';
import { IAccountsService } from './interfaces/accounts.service.interface';
import { LoggerService } from 'src/common/logger/logger.service';
import { error } from 'console';

@Injectable()
export class AccountsService implements IAccountsService {
  constructor(
    @InjectModel(AccountModel) private readonly accountModel: typeof AccountModel,
    private logger: LoggerService
  ) {}

  async create(accountEntity: AccountEntity, transaction?: Transaction): Promise<AccountModel> {
    return this.accountModel.create(accountEntity, { transaction });
  }

  async addCredit(userId: string, amount: number): Promise<ResponseAccontDto> {
    try {
      if (+amount <= 0){
        this.logger.warn(`Invalid credit amount: ${amount} for user ${userId}`);
        throw new BadRequestException('Credit amount must be greater than zero');
      }
  
      const account = await AccountModel.findOne({ where: { userId } });
      
      if (!account) {
        this.logger.warn(`Account not found for user ${userId}`);
        throw new NotFoundException('Account not found');
      }
  
      const accountEntity = new AccountEntity({
        id: account.id,
        userId: account.userId,
        balance: +account.balance
      });
  
      accountEntity.credit(amount);
      account.balance = accountEntity.balance;
      await account.save();
  
      const responseAccontDto = new ResponseAccontDto({
        id: account.id,
        balance: account.balance,
        user_id: account.userId,
        created_at: account.createdAt,
        updated_at: account.updatedAt
      })
      this.logger.debug(`Successfully added credit: ${amount} to account ID: ${account.id}. New balance: ${account.balance}`);
      return responseAccontDto;
    } catch (error) {
      this.logger.error(`Unexpected error occurred: ${JSON.stringify(error)}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<AccountEntity> {
    try {
      const account = await this.accountModel.findOne({where: {id}});
      if(!account) throw new NotFoundException(`Account with id ${id} not found`);

      const accountEntity = new AccountEntity({
        id: account.id,
        userId: account.userId,
        balance: +account.balance
      });

      return accountEntity;
    } catch (error) {
      throw error;
    }
  }

  async findOneByUser(userId: string): Promise<AccountEntity> {
    try {
      const account = await this.accountModel.findOne({where: { userId }});
      if(!account) throw new NotFoundException(`Account with user_id ${userId} not found`);

      const accountEntity = new AccountEntity({
        id: account.id,
        userId: account.userId,
        balance: +account.balance
      });

      return accountEntity;
    } catch (error) {
      throw error;
    }
  }

  async updateBalances(updates: { id: string; balance: number }[], transaction?: Transaction) {
    try {
      const promises = updates.map(update =>
        this.accountModel.update(
          { balance: update.balance },
          { where: { id: update.id }, transaction }
        )
      );
    
      await Promise.all(promises);
      this.logger.debug(`Successfully updated balances for accounts: ${JSON.stringify(updates)}`);
    } catch (error) {
      this.logger.error(`Error updating balances: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAccounts(
    senderId: string, 
    receiverId: string, 
    transaction?: Transaction
  ): Promise<{ senderAccount: AccountEntity; receiverAccount: AccountEntity }> {

    try {
      const accounts = await this.accountModel.findAll({
        where: {
          id: {
            [Op.or]: [senderId, receiverId],
          },
        },
        transaction,
      });
  
      if (accounts.length !== 2) {
        this.logger.warn(`One or both accounts not found. Retrieved accounts: ${JSON.stringify(accounts)}`);
        throw new NotFoundException('One or both accounts not found');
      }
      const [sender, receiver] = accounts[0].id === senderId ? accounts : accounts.reverse();
  
      const senderAccount = new AccountEntity({
        id: sender.id,
        userId: sender.userId,
        balance: +sender.balance
      });
  
      const receiverAccount = new AccountEntity({
        id: receiver.id,
        userId: receiver.userId,
        balance: +receiver.balance
      });
  
      this.logger.debug(`Sender account: ${JSON.stringify(senderAccount)}`);
      this.logger.debug(`Receiver account: ${JSON.stringify(receiverAccount)}`);
      
      return { senderAccount, receiverAccount };
    } catch (error) {
      this.logger.error(`Error fetching accounts: ${error.message}`, error.stack);
      throw error;
    }
  }
}
