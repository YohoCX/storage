import { Decorators } from '@decorators';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Services } from '@services';
import { Types } from '@types';
import { AuthGuard } from '../../auth/auth.guard';
import { DTOs } from '../dtos';
import { Presenters } from '../presenters';

@Controller('transaction')
@UseGuards(AuthGuard)
export class Transaction {
    constructor(
        private readonly transactionService: Services.Transaction,
        private readonly transactionPresenter: Presenters.Transaction,
    ) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get transaction by id' })
    @ApiParam({ name: 'id', type: 'number' })
    async getTransactionById(@Param('id', ParseIntPipe) id: number) {
        return this.transactionPresenter.format(await this.transactionService.getById(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all transactions' })
    async getAllTransactions(@Query() pagination: DTOs.Pagination) {
        return this.transactionPresenter.formatMany(await this.transactionService.getAllPaginated(pagination.options));
    }

    @Post('withdraw')
    @ApiOperation({ summary: 'Withdraw transaction' })
    @ApiBody({ type: DTOs.Transaction.Create })
    async withdraw(
        @Body() body: DTOs.Transaction.Create,
        @Decorators.CurrentUser() current_user: Types.EntityDTO.Auth.CachedPayload,
    ) {
        return this.transactionPresenter.format(
            await this.transactionService.performTransaction(body, current_user.id, 'withdraw'),
        );
    }

    @Post('deposit')
    @ApiOperation({ summary: 'Deposit transaction' })
    @ApiBody({ type: DTOs.Transaction.Create })
    async deposit(
        @Body() body: DTOs.Transaction.Create,
        @Decorators.CurrentUser() current_user: Types.EntityDTO.Auth.CachedPayload,
    ) {
        return this.transactionPresenter.format(
            await this.transactionService.performTransaction(body, current_user.id, 'deposit'),
        );
    }

    @Post('refund')
    @ApiOperation({ summary: 'Refund transaction' })
    @ApiBody({ type: DTOs.Transaction.Create })
    async refund(
        @Body() body: DTOs.Transaction.Create,
        @Decorators.CurrentUser() current_user: Types.EntityDTO.Auth.CachedPayload,
    ) {
        return this.transactionPresenter.format(
            await this.transactionService.performTransaction(body, current_user.id, 'refund'),
        );
    }
}
