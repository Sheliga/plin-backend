import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryDTO } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() category: CategoryDTO) {
    return this.categoryService.create(category);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':categoryId/products')
  async getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.getProductsByCategory(categoryId);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() category: CategoryDTO) {
    return this.categoryService.update(id, category);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.categoryService.findOne(+id);
    return this.categoryService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.categoryService.remove(+id);
    return this.categoryService.remove(id);
  }
}
