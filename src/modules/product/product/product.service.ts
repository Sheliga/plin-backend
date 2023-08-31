import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { validateOrReject } from 'class-validator';
import { PrismaService } from '../../../database/PrismaService';
import { ProductDTO } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(data: ProductDTO) {
    try {
      await validateOrReject(data);

      const product = await this.prisma.product.create({
        data,
      });

      return product;
    } catch (error) {
      throw new BadRequestException({
        message: 'Cadastro fora do padrão',
        error: error,
      });
    }
  }

  findAll() {
    const products = this.prisma.product.findMany();
    return products;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }
  async update(id: string, data: ProductDTO) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Produto não encontrado.');
    }

    try {
      await validateOrReject(data);

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data,
      });

      return updatedProduct;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      if (deletedProduct) {
        console.log('Registro excluído com sucesso:', deletedProduct);
        return deletedProduct;
      } else {
        throw new NotFoundException('Registro não encontrado.');
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Registro não encontrado.');
      }
      console.error('Erro ao excluir o registro:', error);
      throw error;
    }
  }
}
