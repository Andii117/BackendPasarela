import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDTO } from '../dto/user.dto';

@Injectable()
export class UserRepository  {

  constructor(private readonly prisma: PrismaService) {}
    
  createuser(user: UserDTO){
    return this.prisma.users.create({
      data: user
    });
  }
}
