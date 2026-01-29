import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Category } from './category.entity';
import { TransactionType } from '../transactions/enum/transaction-type.enum';
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_transaction_amount')
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Index('idx_transaction_type')
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Index('idx_transaction_date')
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Index('idx_transaction_category_gist', { synchronize: false })
  @ManyToOne(() => Category, (category) => category.transactions, {
    eager: true,
  })
  category: Category;

  @Index('idx_transaction_notes_gist', { synchronize: false })
  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Index('idx_transaction_status')
  @Column()
  status: string;
}
