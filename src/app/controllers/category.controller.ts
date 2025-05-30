import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Services } from '@services';
import { AuthGuard } from '../../auth/auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { DTOs } from '../dtos';
import { Presenters } from '../presenters';

@UseGuards(AuthGuard)
@Controller('category')
export class Category {
    constructor(
        private readonly categoryService: Services.Category,
        private readonly categoryPresenter: Presenters.Category,
    ) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get category by id' })
    @ApiParam({ name: 'id', type: 'number' })
    async getCategoryById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryPresenter.format(await this.categoryService.getById(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    async getAllCategories(@Query() pagination: DTOs.Pagination) {
        const data = await this.categoryService.getAllPaginated(pagination.options);
        return this.categoryPresenter.formatPaginated(data.categories, data.total);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search categories' })
    @ApiParam({ name: 'query', type: 'string' })
    async searchCategories(@Query('query') query: string) {
        return await this.categoryService.search(query);
    }

    @Post()
    @ApiOperation({ summary: 'Create new category' })
    @ApiBody({ type: DTOs.Category.Create })
    async createCategory(@Body() body: DTOs.Category.Create) {
        return this.categoryPresenter.format(await this.categoryService.create(body));
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update category' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({ type: DTOs.Category.Update })
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: DTOs.Category.Update) {
        return this.categoryPresenter.format(await this.categoryService.update(id, body));
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete category' })
    @ApiParam({ name: 'id', type: 'number' })
    async deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.delete(id);
    }
}
