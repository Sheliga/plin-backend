import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { validateOrReject } from 'class-validator';
import { PrismaService } from '../../../database/PrismaService';
import { CategoryDTO } from './category.dto';
@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(data: CategoryDTO) {
    try {
      await validateOrReject(data);

      const category = await this.prisma.category.create({
        data,
      });

      return category;
    } catch (error) {
      throw new BadRequestException({
        message:
          'Cadastro fora do padrão, confira se todos os dados obrigatórios estão preenchidos.',
        error: error,
      });
    }
  }

  findAll() {
    const categories = this.prisma.category.findMany();
    return categories;
  }
  async getProductsByCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category.products;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({ where: { id } });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  // update(id: string, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }
  async update(id: string, data: CategoryDTO) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    try {
      await validateOrReject(data);

      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data,
      });

      return updatedCategory;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const deletedCategory = await this.prisma.category.delete({
        where: { id },
      });

      if (deletedCategory) {
        console.log('Categoria excluída com sucesso:', deletedCategory);
        return deletedCategory;
      } else {
        throw new NotFoundException('Categoria não encontrada.');
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Categoria não encontrada.');
      }
      console.error('Erro ao excluir a categoria:', error);
      throw error;
    }
  }
}
