import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from 'src/products/application/user.service';
import { UserDTO } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAllMockProducts')
  async getAllMockProducts(user: UserDTO) {
    const product = await this.userService.createuser(user);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Post('createUsers')
  async createUsers(@Body() user: UserDTO) {
    const createdUser = await this.userService.createuser(user);
    return createdUser;
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    console.log('Health check endpoint called');
    return {
      status: 'ok - 200',
      timestamp: new Date().toISOString(),
      service: 'payment-backend',
    };
  }
}
