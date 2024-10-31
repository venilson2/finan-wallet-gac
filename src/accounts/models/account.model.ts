import { Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { UserModel } from 'src/users/models/user.model';

@Table({
  tableName: 'accounts',
})
export class AccountModel extends Model<AccountModel> {
  @Column({ 
    type: DataType.UUID, 
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => UserModel)
  @Column({ 
    type: DataType.UUID, 
    allowNull: false,
    unique: true,
    field: 'user_id'
  })
  userId: string;

  @Column({ 
    type: DataType.DECIMAL(10, 2)  
  })
  balance: number;

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
}
