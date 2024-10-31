import { v7 as uuid } from 'uuid';

export class TransferEntity {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: 'completed' | 'reversed';
  originalTransferId?: string;
  constructor(params: Partial<{
    id: string;
    senderId: string;
    receiverId: string;
    amount: number;
    status: 'completed' | 'reversed';
    originalTransferId?: string;
  }>) {
    this.id = params.id || uuid();
    this.senderId = params.senderId;
    this.receiverId = params.receiverId;
    this.amount = params.amount;
    this.status = params.status;
    this.originalTransferId = params.originalTransferId;
  }
}
