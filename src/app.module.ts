import { Module } from '@nestjs/common';
import { ControllersModule } from './products/infrastructure/controllers/controllers.module';
import { PrismaService } from './prisma.service';


@Module({
  imports: [ControllersModule],
})
export class AppModule {}
