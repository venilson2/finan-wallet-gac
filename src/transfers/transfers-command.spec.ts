import { TransfersCommand } from './commands/transfers.command';
import { AccountEntity } from 'src/accounts/entities/account.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TransfersCommand', () => {
  let transfersCommand: TransfersCommand;
  let sourceAccount: AccountEntity;
  let destinationAccount: AccountEntity;

  beforeEach(() => {
    sourceAccount = new AccountEntity({ 
      id: '0192d983-1cd7-705c-8d4c-a16765e9ac43', 
      userId: '0192ddbc-2a1f-763b-b5d3-3ae0b91de5b3', 
      balance: 100 
    });
    destinationAccount = new AccountEntity({ 
      id: '0192d99d-ccb1-76d9-b149-b18090be3d74', 
      userId: '0192de0c-3c00-7391-a355-e7e5d4d5a3bf', 
      balance: 50 
    });
    transfersCommand = new TransfersCommand();
  });

  describe('configure', () => {
    it('should configure source and destination accounts and amount', () => {
      transfersCommand.configure(sourceAccount, destinationAccount, 20);
      expect(transfersCommand['sourceAccount']).toBe(sourceAccount);
      expect(transfersCommand['destinationAccount']).toBe(destinationAccount);
      expect(transfersCommand['amount']).toBe(20);
    });
  });

  describe('validate', () => {
    it('should throw NotFoundException if destination account is not set', () => {
      transfersCommand.configure(sourceAccount, null, 20);
      expect(() => transfersCommand.validate()).toThrow(NotFoundException);
    });

    it('should throw BadRequestException if insufficient funds in source account', () => {
      transfersCommand.configure(sourceAccount, destinationAccount, 150);
      expect(() => transfersCommand.validate()).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if transfer amount is zero or negative', () => {
      transfersCommand.configure(sourceAccount, destinationAccount, 0);
      expect(() => transfersCommand.validate()).toThrow(BadRequestException);

      transfersCommand.configure(sourceAccount, destinationAccount, -10);
      expect(() => transfersCommand.validate()).toThrow(BadRequestException);
    });
    
    it('should not throw an error for valid configuration', () => {
      transfersCommand.configure(sourceAccount, destinationAccount, 20);
      expect(() => transfersCommand.validate()).not.toThrow();
    });
  });

  describe('execute', () => {
    it('should debit the source account and credit the destination account', () => {
      transfersCommand.configure(sourceAccount, destinationAccount, 20);
      transfersCommand.execute();
      expect(sourceAccount.balance).toBe(80); // 100 - 20
      expect(destinationAccount.balance).toBe(70); // 50 + 20
    });
  });

  describe('undo', () => {
    it('should debit the destination account and credit the source account', () => {
      transfersCommand.configure(sourceAccount, destinationAccount, 20);
      transfersCommand.execute(); // Realiza a transferência
      transfersCommand.undo(); // Desfaz a transferência
      expect(sourceAccount.balance).toBe(100); // 80 + 20
      expect(destinationAccount.balance).toBe(50); // 70 - 20
    });
  });
});
