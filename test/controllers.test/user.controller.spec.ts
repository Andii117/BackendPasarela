import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/products/infrastructure/controllers/user.controller';
import { UserService } from '../../src/products/application/user.service';
import { UserDTO } from '../../src/products/infrastructure/dto/user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    createuser: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('getAllMockProducts', () => {
    it('should return product when found', async () => {
      const userDto: UserDTO = { id: 1, name: 'Test User' } as any;
      const product = { id: 1, name: 'Product' };
      mockUserService.createuser.mockResolvedValue(product);
      const result = await userController.getAllMockProducts(userDto);
      expect(result).toEqual(product);
      expect(mockUserService.createuser).toHaveBeenCalledWith(userDto);
    });

    it('should throw NotFoundException when product not found', async () => {
      const userDto: UserDTO = { id: 1, name: 'Test User' } as any;
      mockUserService.createuser.mockResolvedValue(null);
      await expect(userController.getAllMockProducts(userDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUsers', () => {
    it('should create and return user', async () => {
      const userDto: UserDTO = { id: 2, name: 'Another User' } as any;
      const createdUser = { id: 2, name: 'Another User' };
      mockUserService.createuser.mockResolvedValue(createdUser);
      const result = await userController.createUsers(userDto);
      expect(result).toEqual(createdUser);
      expect(mockUserService.createuser).toHaveBeenCalledWith(userDto);
    });
  });
});

