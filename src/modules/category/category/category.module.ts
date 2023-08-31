import { Module } from '@nestjs/common';
import { PrismaService } from '../../../database/PrismaService';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule {}
