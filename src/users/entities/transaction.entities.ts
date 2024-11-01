import { Entity,Column,PrimaryGeneratedColumn,ManyToOne } from "typeorm";
import { user } from "./user.entities";
export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    TRANSFER = 'TRANSFER',
    WITHDRAWAL = 'WITHDRAWAL',
  }
@Entity({name: 'transactions'})
export class transactions{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    amount: number

    @Column({type: 'enum', enum: TransactionType})
    type: TransactionType

    @Column()
    recipientId: string


    @ManyToOne(() => user, (user) => user.transactions)
    user: user;
}