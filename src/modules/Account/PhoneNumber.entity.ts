import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Account } from './Account.entity';

@Entity({ name: 'phone_number' })
export class PhoneNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;
}
