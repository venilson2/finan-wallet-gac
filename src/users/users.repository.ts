import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from './models/user.model';
import { UserEntity } from './entities/user.entity';
import { AccountEntity } from 'src/accounts/entities/account.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { ResponseUserDto } from './dto/response-user.dto';
import { Inject } from '@nestjs/common';

export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @Inject('IAccountsService') private readonly accountsService: AccountsService
  ) {}

  async createUserWithAccount(userEntity: UserEntity, accountEntity: AccountEntity): Promise<ResponseUserDto> {
    const transaction = await this.sequelize.transaction();

    try {
      const userModel = await this.userModel.create(userEntity, { transaction });

      const accountModel = await this.accountsService.create(accountEntity, transaction);

      await transaction.commit();

      const responseUser = new ResponseUserDto({
        id: userModel.id,
        name: userModel.name,
        email: userModel.email,
        account: {
          id: accountModel.id,
          balance: +accountModel.balance,
          created_at: accountModel.createdAt,
          updated_at: accountModel.updatedAt
        },
        created_at: userModel.createdAt,
        updated_at: userModel.updatedAt,
        deleted_at: userModel.deletedAt
      })

      return responseUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}