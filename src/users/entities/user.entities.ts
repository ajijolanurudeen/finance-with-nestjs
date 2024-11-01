import { Entity,Column,PrimaryGeneratedColumn,OneToMany,BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { transactions } from "./transaction.entities";

@Entity({name:'users'})
export class user{
    [x: string]: any;
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('unique:true')
    username: string

    @Column()
    password: string

    @Column()
    balance: number

    @BeforeInsert()
        generateToken() {
    this.token = uuidv4();
         }
    @OneToMany(() => transactions, (transactions) => transactions.user)
    transactions: transactions[];
}