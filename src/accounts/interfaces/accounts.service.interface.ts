import { Transaction } from 'sequelize';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AccountEntity } from '../entities/account.entity';
import { ResponseAccontDto } from '../dto/reponse-account.dto';
import { AccountModel } from '../models/account.model';

export interface IAccountsService {
  create(accountEntity: AccountEntity, transaction: Transaction): Promise<AccountModel>;
  addCredit(userId: string, amount: number): Promise<ResponseAccontDto>;
  findOne(id: string): Promise<AccountEntity>;
  findOneByUser(userId: string): Promise<AccountEntity>;
  updateBalances(updates: { id: string; balance: number }[], transaction?: Transaction): Promise<void>;
  getAccounts(senderId: string, receiverId: string, transaction?: Transaction): Promise<{ senderAccount: AccountEntity; receiverAccount: AccountEntity }>;
}
