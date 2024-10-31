import { Sequelize } from 'sequelize-typescript';
import { UserModel } from './models/user.model';
import { AccountModel } from 'src/accounts/models/account.model';
import { TransferModel } from 'src/transfers/models/transfer.model';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { AccountEntity } from 'src/accounts/entities/account.entity';
import { ResponseUserDto } from './dto/response-user.dto';

class MockUsersRepository implements IUsersRepository {
  async createUserWithAccount(userEntity: UserEntity, accountEntity: AccountEntity): Promise<ResponseUserDto> {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      account: {
        id: accountEntity.id,
        balance: +accountEntity.balance,
        created_at: new Date(),
        updated_at: new Date(),
      },
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    } as ResponseUserDto; 
  }
}

describe('UsersService', () => {
  let sequelize: Sequelize;
  let usersService: UsersService;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([UserModel, AccountModel, TransferModel]);
    await sequelize.sync({ force: true });

    const mockUsersRepository = new MockUsersRepository();
    usersService = new UsersService(UserModel, mockUsersRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a user', async () => {

    const userEntity = new UserEntity({
      email: 'a@a.com',
      name: 'aaa',
      password: '12345',
    });


    const responseUser = await usersService.create(userEntity);

    expect(responseUser).toBeTruthy();
    expect(responseUser.email).toEqual(userEntity.email);
    expect(responseUser.name).toEqual(userEntity.name);
    expect(responseUser.account).toBeDefined();
    expect(responseUser.account.balance).toBeDefined(); 
    expect(responseUser.account.balance).toEqual(0);
  });
});
