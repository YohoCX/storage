import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Services } from '@services';
import { AuthGuard } from '../../auth/auth.guard';
import { DTOs } from '../dtos';

@Controller('product')
@UseGuards(AuthGuard)
export class Product {
    constructor(private readonly productService: Services.Product) {}

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ type: DTOs.Product.Filters })
    @ApiQuery({ type: DTOs.Pagination })
    async getAllProducts(
        @Query() filters: DTOs.Product.Filters,
        @Query() pagination: DTOs.Pagination,
    ) {
        return this.productService.getAllPaginated(
            pagination.paginationOptions,
            filters,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by id' })
    @ApiParam({ name: 'id', type: 'number' })
    async getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create new product' })
    @ApiBody({ type: DTOs.Product.Create })
    async createProduct(@Body() body: DTOs.Product.Create) {
        return this.productService.create(body);
    }

    @Put()
    @ApiOperation({ summary: 'Update product' })
    @ApiBody({ type: DTOs.Product.Update })
    @ApiParam({ name: 'id', type: 'number' })
    async updateProduct(
        @Body() body: DTOs.Product.Update,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productService.update(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete product' })
    @ApiParam({ name: 'id', type: 'number' })
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productService.delete(id);
    }
}
