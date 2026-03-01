import { UserRepository } from '../../src/products/infrastructure/repositories/user.repository';
import { UserDTO } from '../../src/products/infrastructure/dto/user.dto';

describe('UserRepository', () => {
  let repo: UserRepository;

  const mockPrisma = {
    users: {
      create: jest.fn(),
    },
  };

  beforeEach(() => {
    repo = new UserRepository(mockPrisma as any);
    jest.clearAllMocks();
  });

  

  describe('createuser', () => {

    it('should be instantiated directly with new', () => {
      const mockPrisma = {
        users: { create: jest.fn() },
      } as any;

      const repo = new UserRepository(mockPrisma); 
      expect(repo).toBeDefined();
    });

    it('should create an instance with prisma', () => {
      const repo = new UserRepository({} as any);
      expect(repo).toBeInstanceOf(UserRepository);
    });

    it('should be defined', () => {
      expect(repo).toBeDefined();
    });
    


    it('should call prisma.users.create with data', () => {
      const dto: UserDTO = { name: 'Test User' } as any;
      mockPrisma.users.create.mockReturnValue({ ...dto, id: '1' });
      const result = repo.createuser(dto);
      expect(result).toEqual({ id: '1', name: 'Test User' });
      expect(mockPrisma.users.create).toHaveBeenCalledWith({ data: dto });
    });
    it('should handle prisma.users.create throwing error', () => {
      const dto: UserDTO = { name: 'Error User' } as any;
      mockPrisma.users.create.mockImplementation(() => { throw new Error('DB error'); });
      expect(() => repo.createuser(dto)).toThrow('DB error');
    });
    it('should handle prisma.users.create returning undefined', () => {
      const dto: UserDTO = { name: 'Undefined User' } as any;
      mockPrisma.users.create.mockReturnValue(undefined);
      const result = repo.createuser(dto);
      expect(result).toBeUndefined();
    });
  });
});
