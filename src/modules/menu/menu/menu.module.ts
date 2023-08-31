import { Module } from '@nestjs/common';
import { PrismaService } from '../../../database/PrismaService';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService, PrismaService],
})
export class MenuModule {}
