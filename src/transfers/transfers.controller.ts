import { Controller, Post, Body, UseGuards, Param, Inject } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user/current-user.decorator';
import { AuthUser } from 'src/auth/dto/auth-user.dto';

@UseGuards(AuthGuard)
@Controller('transfers')
export class TransfersController {
  constructor(@Inject('ITransfersService') private readonly transfersService: TransfersService) {}

  @Post()
  async transfer(
    @CurrentUser() user: AuthUser, 
    @Body() createTransferDto: CreateTransferDto) {
    return await this.transfersService.transfer(createTransferDto, user);
  }

  @Post('/:id/reverse')
  async reverseTransfer(
    @CurrentUser() user: AuthUser, 
    @Param('id') id: string
  ) {
    return await this.transfersService.reverseTransfer(id, user);
  }
}
