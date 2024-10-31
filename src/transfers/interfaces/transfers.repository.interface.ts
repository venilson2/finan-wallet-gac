import { TransferEntity } from '../entities/transfer.entity';
import { Transaction } from 'sequelize';

export interface ITransfersRepository {
  create(transfer: TransferEntity, transaction?: Transaction): Promise<TransferEntity>;
  updateStatus(id: string, status: 'completed' | 'reversed', transaction?: Transaction): Promise<number>;
  findOne(transferId: string, userId: string, transaction?: Transaction): Promise<TransferEntity | null>;
}
