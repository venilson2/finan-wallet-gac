import { AccountEntity } from 'src/accounts/entities/account.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ITransfersCommand } from '../interfaces/transfers-command.interface';

export class TransfersCommand implements ITransfersCommand {
  private sourceAccount: AccountEntity;
  private destinationAccount: AccountEntity;
  private amount: number;

  constructor() {}

  configure(sourceAccount: AccountEntity, destinationAccount: AccountEntity, amount: number) {
    this.sourceAccount = sourceAccount;
    this.destinationAccount = destinationAccount;
    this.amount = amount;
  }

  execute() {
    this.sourceAccount.debit(this.amount);
    this.destinationAccount.credit(this.amount);
  }

  undo() {
    this.destinationAccount.debit(this.amount);
    this.sourceAccount.credit(this.amount);
  }

  validate() {
    if (!this.destinationAccount) throw new NotFoundException('Destination account not found');
    if (this.sourceAccount.balance < this.amount) throw new BadRequestException('Insufficient funds in source account');
    if (this.amount <= 0) throw new BadRequestException('Transfer amount must be greater than zero');
  }
}