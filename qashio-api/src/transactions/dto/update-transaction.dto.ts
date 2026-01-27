import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../enum/transaction-type.enum';

export class UpdateTransactionDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsOptional()
  notes?: string;
}
