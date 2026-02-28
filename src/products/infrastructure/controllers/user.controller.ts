import { Controller, Get, Post, Param, NotFoundException, Body } from '@nestjs/common';
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
    console.log("CONTROLLER userRepo", user);
    const createdUser = await this.userService.createuser(user);
    console.log("CONTROLLER createdUser", createdUser);
    return createdUser;
  }

}
