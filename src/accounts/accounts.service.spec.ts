import { Sequelize } from 'sequelize-typescript';
import { AccountModel } from 'src/accounts/models/account.model';
import { TransferModel } from 'src/transfers/models/transfer.model';
import { AccountEntity } from 'src/accounts/entities/account.entity';
import { AccountsService } from './accounts.service';
import { UserModel } from 'src/users/models/user.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';

describe('AccountService', () => {
  let sequelize: Sequelize;
  let accountsService: AccountsService;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([UserModel, AccountModel, TransferModel]);
    await sequelize.sync({ force: true });

    const logger = new LoggerService();
    accountsService = new AccountsService(AccountModel, logger);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a account', async () => {

    const userModel = await UserModel.create({
      id: '0192ddbc-4cad-755a-a9bf-c2ef673167d6',
      email: 'user@example.com',
      name: 'User Name',
      password: 'hashed_password',
    });

    const accountEntity = new AccountEntity({
      userId: userModel.id
    });

    const responseAccount = await accountsService.create(accountEntity);

    expect(responseAccount).toBeTruthy();
    expect(responseAccount.userId).toEqual(accountEntity.userId);
    expect(responseAccount.balance).toEqual(0);
  });

  it('should add credit to an account', async () => {
    // Cria um usuário
    const userModel = await UserModel.create({
      id: '0192ddbc-4cad-755a-a9bf-c2ef673167d6',
      email: 'user@example.com',
      name: 'User Name',
      password: 'hashed_password',
    });

    const accountEntity = new AccountEntity({
      userId: userModel.id,
      balance: 100
    });

    const responseAccount = await accountsService.create(accountEntity);

    expect(responseAccount.balance).toEqual(100);

    const responseAccountDto = await accountsService.addCredit(userModel.id, 50);
    expect(responseAccountDto).toBeTruthy();
    expect(responseAccountDto.balance).toEqual(150);
    expect(responseAccountDto.user_id).toEqual(userModel.id);
  });

  it('should throw NotFoundException if account does not exist', async () => {
    const userId = 'non-existing-user-id';
    await expect(accountsService.addCredit(userId, 50)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if adding credit amount is zero', async () => {
    const userModel = await UserModel.create({
      id: '0192ddbc-4cad-755a-a9bf-c2ef673167d6',
      email: 'user@example.com',
      name: 'User Name',
      password: 'hashed_password',
    });

    const accountEntity = new AccountEntity({
      userId: userModel.id,
    });

    await AccountModel.create(accountEntity);

    await expect(accountsService.addCredit(userModel.id, 0)).rejects.toThrow(BadRequestException);
  });

  it('should return sender and receiver accounts', async () => {

    const userSender = await UserModel.create({
      id: '0192d99d-ccb1-76d9-b149-b18090be3d74',
      email: 'sender@example.com',
      name: 'Sender Name',
      password: 'hashed_password',
    });

    const userReiceiver = await UserModel.create({
      id: '0192ddbc-4cad-755a-a9bf-c2ef673167d6',
      email: 'reiceiver@example.com',
      name: 'Reiceiver Name',
      password: 'hashed_password',
    });

    const senderAccount = await AccountModel.create({
      id: '0192dafb-aa62-77b8-9b2a-28c6f6551a4a',
      userId: userSender.id,
      balance: 100,
    });

    const receiverAccount = await AccountModel.create({
      id: '0192db14-1bb7-74bd-98a4-4dcc37aaf367',
      userId: userReiceiver.id,
      balance: 200,
    });

    const result = await accountsService.getAccounts(senderAccount.id, receiverAccount.id);

    expect(result.senderAccount).toBeTruthy();
    expect(result.receiverAccount).toBeTruthy();
    expect(result.senderAccount.id).toEqual(senderAccount.id);
    expect(result.receiverAccount.id).toEqual(receiverAccount.id);
  });

  it('should throw NotFoundException if one or both accounts are not found', async () => {
    await expect(accountsService.getAccounts('invalid-sender-id', 'invalid-receiver-id')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if only one account is found', async () => {

    const userSender = await UserModel.create({
      id: '0192d99d-ccb1-76d9-b149-b18090be3d74',
      email: 'sender@example.com',
      name: 'Sender Name',
      password: 'hashed_password',
    });

    const senderAccount = await AccountModel.create({
      id: '0192dafb-aa62-77b8-9b2a-28c6f6551a4a',
      userId: userSender.id,
      balance: 100,
    });

    await expect(accountsService.getAccounts(senderAccount.id, 'invalid-receiver-id')).rejects.toThrow(NotFoundException);
  });

  it('should return the account if it exists', async () => {
    const user = await UserModel.create({
      id: '0192d99d-ccb1-76d9-b149-b18090be3d74',
      email: 'sender@example.com',
      name: 'Sender Name',
      password: 'hashed_password',
    });

    const account = await AccountModel.create({
      id: '0192dafb-aa62-77b8-9b2a-28c6f6551a4a',
      userId: user.id,
      balance: 100,
    });

    const accountEntity = await accountsService.findOne(account.id);
    expect(accountEntity).toBeInstanceOf(AccountEntity);
    expect(accountEntity.id).toBe(account.id);
    expect(accountEntity.userId).toBe(account.userId);
    expect(accountEntity.balance).toBe(100);

    const accountEntityByEmail = await accountsService.findOneByUser(account.userId);

    expect(accountEntity).toBeInstanceOf(AccountEntity);
    expect(accountEntity.id).toBe(account.id);
    expect(accountEntity.userId).toBe(account.userId);
    expect(accountEntity.balance).toBe(100);

  });

  it('should throw NotFoundException if the account does not exist', async () => {
    await expect(accountsService.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
  });

  describe('AccountEntity', () => {
    let accountEntity: AccountEntity;
  
    beforeEach(() => {
      accountEntity = new AccountEntity({
        userId: '0192d99d-ccb1-76d9-b149-b18090be3d74',
        balance: 100,
      });
    });
  
    describe('credit', () => {
      it('should add credit to the balance', () => {
        accountEntity.credit(50);
        expect(accountEntity.balance).toBe(150);
      });
    });
  
    describe('debit', () => {
      it('should deduct amount from the balance', () => {
        accountEntity.debit(30);
        expect(accountEntity.balance).toBe(70); 
      });
  
      it('should throw an error if debit amount exceeds balance', () => {
        expect(() => {
          accountEntity.debit(150);
        }).toThrow('Insufficient balance');
      });
  
      it('should allow debiting zero amount', () => {
        accountEntity.debit(0);
        expect(accountEntity.balance).toBe(100);
      });
    });
  });
});
