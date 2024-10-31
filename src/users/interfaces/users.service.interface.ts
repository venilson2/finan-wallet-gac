import { CreateUserDto } from "../dto/create-user.dto";
import { ResponseUserDto } from "../dto/response-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<ResponseUserDto>;
  findAll(): Promise<ResponseUserDto[]>;
  findOne(id: string): Promise<ResponseUserDto>;
  findOneByEmail(email: string): Promise<ResponseUserDto>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto>;
  remove(id: string): Promise<void>;
}