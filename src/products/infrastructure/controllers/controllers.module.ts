import { Module } from '@nestjs/common';
import { ProductService } from  '../../application/product.service';
import { ProductController } from './product.controller';
import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';
import { UserService } from 'src/products/application/user.service';

@Module({
    controllers: [ProductController,UserController],
    providers: [
        ProductService,
        PrismaService,
        UserService,
        { provide: 'ProductRepository', useClass: ProductRepository },
        { provide: 'UserRepository', useClass: UserRepository },
    ],    
    exports: [PrismaService], 
})
export class ControllersModule {}


