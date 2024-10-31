import { Controller, Body, Patch, UseGuards, Inject } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CurrentUser } from 'src/common/decorators/current-user/current-user.decorator';
import { AuthUser } from 'src/auth/dto/auth-user.dto';
import { AddCreditDto } from './dto/add-credit.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { ResponseAccontDto } from './dto/reponse-account.dto';
import { IAccountsService } from './interfaces/accounts.service.interface';

@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(@Inject('IAccountsService') private readonly accountsService: IAccountsService) {}

  @Patch('add-credit')
  async addCredit(
    @CurrentUser() user: AuthUser, 
    @Body() addCreditDto: AddCreditDto
  ): Promise<ResponseAccontDto>  {
    return await this.accountsService.addCredit(user.id, addCreditDto.amount);
  }
}
