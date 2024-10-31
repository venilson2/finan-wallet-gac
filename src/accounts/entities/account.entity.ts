import { BadRequestException, NotFoundException } from '@nestjs/common';
import { v7 as uuid } from 'uuid';

export class AccountEntity {
  id: string;
  userId: string;
  balance: number; 

  constructor(params: Partial<{
    id: string;
    userId: string;
    balance: number;
  }>) {
    this.id = params.id || uuid();
    this.userId = params.userId;
    this.balance = params.balance || 0;
  }

  debit(amount: number) {
    if (this.balance < amount) throw new Error('Insufficient balance');
    this.balance -= amount;
  }

  credit(amount: number) {
    this.balance += amount;
  }
}
