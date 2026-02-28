import { Injectable, Inject } from '@nestjs/common';
import type { ProductRepository } from '../domain/product.repository.interface';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UserDTO } from '../infrastructure/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
  ) {}

  createuser(user: UserDTO){
      return this.userRepo.createuser(user);
    }


}

    