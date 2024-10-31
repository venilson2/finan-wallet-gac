import { InjectModel } from '@nestjs/sequelize';
import { TransferModel } from './models/transfer.model';
import { Transaction } from 'sequelize';
import { TransferEntity } from './entities/transfer.entity';
import { ITransfersRepository } from './interfaces/transfers.repository.interface';

export class TransfersRepository implements ITransfersRepository {
  constructor(
    @InjectModel(TransferModel) private transferModel: typeof TransferModel,
  ) {}

  async create(transferEntity: TransferEntity, transaction?: Transaction) {
    return await this.transferModel.create(transferEntity, { transaction });
  }

  async updateStatus(id: string, status: 'completed' | 'reversed', transaction?: Transaction) {
    const [affectedCount] = await this.transferModel.update(
      { status },
      {
        where: { id },
        transaction,
      }
    );

    if (affectedCount === 0) {
      throw new Error('Failed to update transfer status');
    }

    return affectedCount;
  }

  async findOne(transferId: string, userId: string, transaction?: Transaction) {
    return await this.transferModel.findOne({
      where: { 
        id: transferId, 
        senderId: userId
      },
      transaction
    });
  }
}