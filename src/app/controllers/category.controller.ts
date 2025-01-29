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
import { Roles } from '../../decorators/role.decorator';
import { DTOs } from '../dtos';

@UseGuards(AuthGuard)
@Controller('category')
export class Category {
    constructor(private readonly categoryService: Services.Category) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get category by id' })
    @ApiParam({ name: 'id', type: 'number' })
    async getCategoryById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiQuery({ type: DTOs.Pagination })
    async getAllCategories(@Query() pagination: DTOs.Pagination) {
        return this.categoryService.getAllPaginated(
            pagination.paginationOptions,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Create new category' })
    @ApiBody({ type: DTOs.Category.Create })
    async createCategory(@Body() body: DTOs.Category.Create) {
        return this.categoryService.create(body);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update category' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({ type: DTOs.Category.Update })
    async updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: DTOs.Category.Update,
    ) {
        return this.categoryService.update(id, body);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete category' })
    @ApiParam({ name: 'id', type: 'number' })
    async deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.delete(id);
    }
}
