import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/products/application/user.service';
import { UserDTO } from '../../src/products/infrastructure/dto/user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepo: any;

  const mockUserRepo = {
    createuser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get('UserRepository');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createuser', () => {
    it('should call repo and return result', async () => {
      const dto: UserDTO = { name: 'Test User' } as any;
      const result = { ...dto, id: '1' };
      mockUserRepo.createuser.mockResolvedValue(result);
      await expect(service.createuser(dto)).resolves.toEqual(result);
      expect(userRepo.createuser).toHaveBeenCalledWith(dto);
    });
     it('should throw if repo throws', async () => {
    const dto: UserDTO = { name: 'Test User' } as any;
    mockUserRepo.createuser.mockRejectedValue(new Error('DB error'));

    await expect(service.createuser(dto)).rejects.toThrow('DB error');
  });
    it('should return null if repo returns null', async () => {
    const dto: UserDTO = { name: 'Test User' } as any;
    mockUserRepo.createuser.mockResolvedValue(null);

    await expect(service.createuser(dto)).resolves.toBeNull();
  });
  });

  
});
