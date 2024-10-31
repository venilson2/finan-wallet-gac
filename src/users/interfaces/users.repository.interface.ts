import { AccountEntity } from 'src/accounts/entities/account.entity';
import { UserEntity } from '../entities/user.entity';
import { ResponseUserDto } from '../dto/response-user.dto';

export interface IUsersRepository {
  createUserWithAccount(userEntity: UserEntity, accountEntity: AccountEntity): Promise<ResponseUserDto>;
}
