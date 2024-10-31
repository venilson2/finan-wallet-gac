import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { UserModel } from 'src/users/models/user.model';

@Table({
  tableName: 'transfers',
})
export class TransferModel extends Model<TransferModel> {
  @Column({ 
    type: DataType.UUID, 
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => UserModel)
  @Column({
    field: 'sender_id',
    type: DataType.UUID,
    allowNull: false,
  })
  senderId: string;

  @ForeignKey(() => UserModel)
  @Column({
    field: 'receiver_id',
    type: DataType.UUID,
    allowNull: false,
  })
  receiverId: string;

  @Column({ 
    type: DataType.DECIMAL(10, 2), 
    allowNull: false 
  })
  amount: number;

  @Column({ 
    type: DataType.ENUM('completed', 'reversed'), 
    allowNull: false, 
  })
  status: 'completed' | 'reversed';


  @ForeignKey(() => TransferModel)
  @Column({
    field: 'original_transfer_id',
    type: DataType.UUID,
    allowNull: true,
  })
  originalTransferId: string | null;

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;
  
  @UpdatedAt
  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: Date;
  
  @DeletedAt
  @Column({
    field: 'deleted_at',
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: Date | null;

  @BelongsTo(() => UserModel, 'senderId')
  sender: UserModel;

  @BelongsTo(() => UserModel, 'receiverId')
  receiver: UserModel;

  @BelongsTo(() => TransferModel, 'originalTransferId')
  originalTransfer: TransferModel | null;
}
