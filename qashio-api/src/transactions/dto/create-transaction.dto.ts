import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../enum/transaction-type.enum';
import { TransactionStatus } from '../enum/transaction-status.enum';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  notes?: string;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus;
}
