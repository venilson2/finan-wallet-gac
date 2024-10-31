import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, HasMany, HasOne, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { AccountEntity } from 'src/accounts/entities/account.entity';
import { AccountModel } from 'src/accounts/models/account.model';

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel> {
  @Column({ 
    type: DataType.UUID, 
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({ 
    type: DataType.STRING, 
    allowNull: false 
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

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

  @HasOne(() => AccountModel) 
  account: AccountEntity;

  @BelongsTo(() => UserModel, 'senderId')
  sender: UserModel;

  @BelongsTo(() => UserModel, 'receiverId')
  receiver: UserModel;
}