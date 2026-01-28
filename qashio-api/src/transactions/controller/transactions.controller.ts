import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post('create')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get('transaction/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.transactionService.findOne(id);
  }

  @Get('all-transactions')
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.transactionService.getFilteredTransactions(paginationQuery);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Patch('remove/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.transactionService.remove(id);
  }
}
