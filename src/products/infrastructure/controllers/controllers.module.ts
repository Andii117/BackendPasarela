import { Module } from '@nestjs/common';
import { ProductService } from  '../../application/product.service';
import { ProductController } from './product.controller';
import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';
import { UserService } from 'src/products/application/user.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionService } from 'src/products/application/transaction.service';
import { TransactionAPIDomain } from 'src/products/domain/transactions.api.domain';
import { HttpModule  } from '@nestjs/axios';
import { HttpService  } from '@nestjs/axios';

@Module({
    controllers: [ProductController,UserController,TransactionController],
    imports: [HttpModule], 
    providers: [
        ProductService,
        PrismaService,
        UserService,
        TransactionService,
        { provide: 'ProductRepository', useClass: ProductRepository },
        { provide: 'UserRepository', useClass: UserRepository },
        { provide: 'TransactionRepository', useClass: TransactionRepository },
        { provide: 'TransactionAPIDomain', useClass: TransactionAPIDomain },
        
    ],    
    exports: [PrismaService], 
})
export class ControllersModule {}


