import { AuthUser } from 'src/auth/dto/auth-user.dto';
import { CreateTransferDto } from '../dto/create-transfer.dto';

export interface ITransfersService {
  transfer(createTransferDto: CreateTransferDto, user: AuthUser): Promise<string>;
  reverseTransfer(transferId: string, user: AuthUser): Promise<string>;
}