import { Module } from '@nestjs/common';
import { CategoryModule } from './modules/category/category/category.module';
import { ProductModule } from './modules/product/product/product.module';
import { MenuModule } from './modules/menu/menu/menu.module';

@Module({
  imports: [CategoryModule, ProductModule, MenuModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
