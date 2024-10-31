import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { AccountEntity } from 'src/accounts/entities/account.entity';
import { ResponseUserDto } from './dto/response-user.dto';
import { AccountModel } from 'src/accounts/models/account.model';
import { IUsersService } from './interfaces/users.service.interface';
import { IUsersRepository } from './interfaces/users.repository.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @Inject('IUsersRepository') private readonly usersRepository: IUsersRepository
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    try {
      const {password} = createUserDto
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new UserEntity({
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword
      })

      const account= new AccountEntity({
        userId: user.id
      })
      
      const responseUser = await this.usersRepository.createUserWithAccount(user, account);
      return responseUser;
      
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const duplicateField = error.errors?.[0]?.path || 'email';
        throw new ConflictException(`A user already exists with this ${duplicateField}.`);
      }
      console.error(error)
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<ResponseUserDto[]> {
    try{
      const users = await this.userModel.findAll();

      const responseUsers = users.map(user => new ResponseUserDto({
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        deleted_at: user.deletedAt
      }))
      return responseUsers;
    } catch(error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    try {
      const user = await this.userModel.findOne({where: {id}});
      if(!user) throw new NotFoundException();

      const responseUserDto = new ResponseUserDto({
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        deleted_at: user.deletedAt
      })

      return responseUserDto;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOneByEmail(email: string): Promise<ResponseUserDto> {
    try {
      const userModel = await this.userModel.findOne({
        where: { email },
        include: [
          {
            model: AccountModel,
            as: 'account',
          },
        ],
      });

      const responseUserDto = new ResponseUserDto({
        id: userModel.id,
        name: userModel.name,
        email: userModel.email,
        password: userModel.password,
        account: {
          id: userModel.account.id,
          balance: userModel.account.balance
        },
        created_at: userModel.createdAt,
        updated_at: userModel.updatedAt,
        deleted_at: userModel.deletedAt
      })

      return responseUserDto;

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    try{
      const { password } = updateUserDto;

      if(password){
        const hashedPassword = await bcrypt.hash(password, 10);
        updateUserDto.password = hashedPassword;
      }
  
      const [affectedCount, updated] = await this.userModel.update(updateUserDto, {
        where: { id } ,
        returning: true
      });
  
      if (affectedCount == 0 && updated.length == 0){
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const responseUserDto = new ResponseUserDto({
        id: updated[0].id,
        name: updated[0].name,
        email: updated[0].email,
        account: {
          id: updated[0].account.id,
          balance: updated[0].account.balance
        },
        created_at: updated[0].createdAt,
        updated_at: updated[0].updatedAt,
        deleted_at: updated[0].deletedAt
      });
      
      return responseUserDto;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const deletedCount = await this.userModel.destroy({ where: { id } });
  
      if (deletedCount === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}