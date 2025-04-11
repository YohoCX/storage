import { Decorators } from '@decorators';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Services } from '@services';
import { Types } from '@types';
import { AuthGuard } from '../../auth/auth.guard';
import { Roles } from '../../decorators/role.decorator';
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
    @ApiOperation({ summary: 'Get all transactions paginated' })
    async getTransactionsPaginated(@Query() pagination: DTOs.Pagination, @Query() filters: DTOs.Transaction.Filter) {
        const data = await this.transactionService.getAllPaginated(pagination.options, filters);
        return this.transactionPresenter.formatPaginated(data.data, data.total);
    }

    @Get('pending')
    @ApiOperation({ summary: 'Get pending transaction' })
    async getPendingTransaction(@Decorators.CurrentUser() current_user: Types.EntityDTO.Auth.CachedPayload) {
        const transaction = await this.transactionService.getPendingTransaction(current_user.id);
        return this.transactionPresenter.format(transaction);
    }

    @Get(':id/items')
    @ApiOperation({ summary: 'Get transaction items by transaction id' })
    @ApiParam({ name: 'id', type: 'number' })
    async getTransactionItems(@Param('id', ParseIntPipe) id: number) {
        return this.transactionService.getTransactionItems(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create transaction' })
    @ApiBody({ type: DTOs.Transaction.Create })
    async create(
        @Body() body: DTOs.Transaction.Create,
        @Decorators.CurrentUser() current_user: Types.EntityDTO.Auth.CachedPayload,
    ) {
        return this.transactionPresenter.format(await this.transactionService.create(body, current_user.id));
    }

    @Post(':id/add-product')
    @ApiOperation({ summary: 'Add product to transaction' })
    @ApiBody({ type: DTOs.Transaction.TransactionProduct })
    async addProductToTransaction(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: DTOs.Transaction.TransactionProduct,
    ) {
        await this.transactionService.createCartItem(body, id);

        return {
            message: 'Success',
        };
    }

    //
    // @Post(':id/update-product')
    // @ApiOperation({ summary: 'Update product in transaction' })
    // @ApiBody({ type: DTOs.Transaction.TransactionProduct })
    // async updateProductInTransaction(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() body: DTOs.Transaction.TransactionProduct,
    // ) {
    //     await this.transactionService.updateCartItem(body, id);
    //
    //     return {
    //         message: 'Success',
    //     };
    // }

    @Post(':id/remove-product/:product_id')
    @ApiOperation({ summary: 'Remove product from transaction' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiParam({ name: 'product_id', type: 'number' })
    async removeProductFromTransaction(
        @Param('id', ParseIntPipe) id: number,
        @Param('product_id', ParseIntPipe) product_id: number,
    ) {
        await this.transactionService.removeCartItem(id, product_id);

        return {
            message: 'Success',
        };
    }

    @Post(':id/finalize')
    @ApiOperation({ summary: 'Finalize transaction' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({ type: DTOs.Transaction.AddProducts })
    async finalizeTransaction(@Param('id', ParseIntPipe) id: number, @Body() body: DTOs.Transaction.AddProducts) {
        await this.transactionService.finalizeCartToWithdraw(body, id);

        return {
            message: 'Success',
        };
    }

    @Post(':id/perform')
    @ApiOperation({ summary: 'Perform transaction' })
    @ApiParam({ name: 'id', type: 'number' })
    async performTransaction(@Param('id', ParseIntPipe) id: number) {
        await this.transactionService.performTransaction(id);

        return {
            message: 'Success',
        };
    }

    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Cancel transaction' })
    @ApiParam({ name: 'id', type: 'number' })
    async cancelTransaction(@Param('id', ParseIntPipe) id: number) {
        await this.transactionService.cancelTransaction(id);

        return {
            message: 'Success',
        };
    }
}
