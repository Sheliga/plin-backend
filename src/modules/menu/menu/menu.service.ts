import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/PrismaService';
import { MenuDTO } from './menu.dto';

@Injectable()
export class MenuService {
  isDaytime() {
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 18; // Define o intervalo de horas do dia
  }
  constructor(private prisma: PrismaService) {}

  private async validateProductIds(productIds: string[]) {
    const existingProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (existingProducts.length !== productIds.length) {
      throw new BadRequestException(
        'Um ou mais IDs de produtos são inválidos.',
      );
    }
  }

  async create(data: MenuDTO) {
    try {
      await this.validateProductIds(data.products);

      const productsToConnect = data.products.map((productId) => ({
        id: productId,
      }));

      const menuData = {
        name: data.name,
        isDaytime: data.isDaytime,
        isNighttime: data.isNighttime,
        products: { connect: productsToConnect },
      };

      const createdMenu = await this.prisma.menu.create({ data: menuData });

      return createdMenu;
    } catch (error) {
      console.error('Erro de validação:', error);

      throw new BadRequestException({
        message: 'Cadastro fora do padrão',
        error: error,
      });
    }
  }
  async update(id: string, data: MenuDTO) {
    const existingMenu = await this.prisma.menu.findUnique({ where: { id } });

    if (!existingMenu) {
      throw new NotFoundException('Cardápio não encontrado.');
    }

    try {
      await this.validateProductIds(data.products);

      const productsToConnect = data.products.map((productId) => ({
        id: productId,
      }));

      const updatedMenuData = {
        name: data.name,
        isDaytime: data.isDaytime,
        isNighttime: data.isNighttime,
        products: { connect: productsToConnect },
      };

      const updatedMenu = await this.prisma.menu.update({
        where: { id },
        data: updatedMenuData,
      });

      return updatedMenu;
    } catch (error) {
      throw new BadRequestException({
        message: 'Erro ao atualizar o cardápio.',
        error: error,
      });
    }
  }

  async findAll() {
    const menus = await this.prisma.menu.findMany();
    return menus;
  }
  async getMenuBasedOnTime() {
    const isDaytime = this.isDaytime();
    const period = isDaytime ? 'day' : 'night';

    const menu = await this.prisma.menu.findFirst({
      where: {
        OR: [
          { isDaytime: period === 'day' },
          { isNighttime: period === 'night' },
        ],
      },
      include: {
        products: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(`No ${period} menu available.`);
    }
    // Organizar produtos por categorias
    const categorizedProducts = menu.products.reduce((acc, product) => {
      if (!acc[product.category.id]) {
        acc[product.category.id] = {
          category: product.category,
          products: [],
        };
      }
      acc[product.category.id].products.push(product);
      return acc;
    }, {});

    const categoriesWithProducts = Object.values(categorizedProducts);

    return {
      ...menu,
      categories: categoriesWithProducts,
    };
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findFirst({
      where: {
        id,
      },
      include: {
        products: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(`Cardapio não encontrado`);
    }
    // Organizar produtos por categorias
    const categorizedProducts = menu.products.reduce((acc, product) => {
      if (!acc[product.category.id]) {
        acc[product.category.id] = {
          category: product.category,
          products: [],
        };
      }
      acc[product.category.id].products.push(product);
      return acc;
    }, {});

    const categoriesWithProducts = Object.values(categorizedProducts);

    return {
      ...menu,
      categories: categoriesWithProducts,
    };
  }

  async remove(id: string) {
    const existingMenu = await this.prisma.menu.findUnique({ where: { id } });

    if (!existingMenu) {
      throw new NotFoundException('Cardápio não encontrado.');
    }

    try {
      const deletedMenu = await this.prisma.menu.delete({ where: { id } });
      return deletedMenu;
    } catch (error) {
      throw new BadRequestException('Erro ao excluir o cardápio.');
    }
  }
}
