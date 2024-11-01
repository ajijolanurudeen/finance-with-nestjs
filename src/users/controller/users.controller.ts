import { Body, Controller } from '@nestjs/common';
import { Get,Post,Put,Delete,Request,Response,Param,Req} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../Dto/create-user-dto';
import { FundAccountDto } from '../Dto/fundAccount-dto';
import { TransferFundsDto } from '../Dto/transferFunds-dto';
import { WithdrawFundsDto } from '../Dto/withdrawFunds-dto';
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

@Post()
async createUser(@Body() CreateUserDto: CreateUserDto){
    return this.userService.createUser(CreateUserDto)
}

@Post(':id/fund')
  async fundAccount(
    @Req() req,
    @Param('id') id: string,
    @Body() fundAccountDto: FundAccountDto,
  ) {
    return this.userService.fundAccount(id, fundAccountDto);
  }

  @Post(':id/transfer')
  async transferFunds(
    @Req() req,
    @Param('id') id: string,
    @Body() transferFundsDto: TransferFundsDto,
  ) {
    return this.userService.transferFunds(id, transferFundsDto);
  }

  @Post(':id/withdraw')
  async withdrawFunds(
    @Req() req,
    @Param('id') id: string,
    @Body() withdrawFundsDto: WithdrawFundsDto,

  ) {
    return this.userService.withdrawFunds(id, withdrawFundsDto);
  }

}
