import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import  bcrypt from 'bcryptjs';
import { userInterface } from '../interfaces/createUserInterface';
import { fundAccountInterface } from '../interfaces/fundAccountInterface';
import { TransferFundsDto } from '../Dto/transferFunds-dto';
import { withdrawFundsInterface } from '../interfaces/withdrawFundsInterface';
import { user } from '../entities/user.entities';
import { TransactionType,transactions } from '../entities/transaction.entities';
import { FundAccountDto } from '../Dto/fundAccount-dto';
import { transferFundsInterface } from '../interfaces/transferFundsInterface';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(user)
        private readonly userRepository: Repository<user>,

        @InjectRepository(transactions)
        private readonly transactionsRepository: Repository<transactions>
    ){}

    async createUser(CreateUserDto:userInterface): Promise<user>{
        const{
            username,
            password
        
    }=CreateUserDto
    const saltRounds = 10;
    const existingUser = await this.userRepository.findOne({
        where:{
            username
        }
    })
    if (existingUser){
        throw new HttpException('user already exists',HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(
        password,
        saltRounds
    )
    const user = this.userRepository.save({
        ...CreateUserDto,
        password: hashedPassword
    })
    return user
}

async fundAccount(username: string, fundAccountDto: FundAccountDto): Promise<user> {
    const user = await this.userRepository.findOne({where:{username}});
    if (!user) throw new NotFoundException('User not found');

    user.balance += fundAccountDto.amount;
    await this.userRepository.save(user);

    const transaction = this.transactionsRepository.create({
      user,
      amount: fundAccountDto.amount,
      type: TransactionType.DEPOSIT,
    });
    await this.transactionsRepository.save(transaction);

    return user;
  }

async transferFunds(id:string, transferFundsDto: TransferFundsDto): Promise<user> {
    const sender = await this.userRepository.findOne({
        where:{id}
    });
    const recipient = await this.userRepository.findOne({
        where: { id: transferFundsDto.recipientId },
      });
    if (!sender || !recipient) throw new NotFoundException('User not found');
    if (sender.balance < transferFundsDto.amount) throw new BadRequestException('Insufficient balance');

    sender.balance -= transferFundsDto.amount;
    recipient.balance += transferFundsDto.amount;

    await this.userRepository.save([sender, recipient]);

    const transaction = this.transactionsRepository.create({
      user: sender,
      amount: transferFundsDto.amount,
      type: TransactionType.TRANSFER,
      recipientId: recipient.id,
    });
    await this.transactionsRepository.save(transaction);

    return sender;
  }

async withdrawFunds(id: string, withdrawFundsDto:withdrawFundsInterface): Promise<user> {
    const user = await this.userRepository.findOne({
        where:{id}
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.balance < withdrawFundsDto.amount) throw new BadRequestException('Insufficient balance');

    user.balance -= withdrawFundsDto.amount;
    await this.userRepository.save(user);

    const transaction = this.transactionsRepository.create({
      user,
      amount: withdrawFundsDto.amount,
      type: TransactionType.WITHDRAWAL,
    });
    await this.transactionsRepository.save(transaction);

    return user;
  }
}


