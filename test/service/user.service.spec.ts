import { Test, TestingModule } from '@nestjs/testing';
import { GenreRepository } from 'src/app/genre/genre.repository';
import { ShoppingCartRepository } from 'src/app/shopping-cart/shopping-cart.repository';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { User } from 'src/app/user/user.entity';
import { UserRepository } from 'src/app/user/user.repository';
import { UserService } from 'src/app/user/user.service';


describe('UserService', () => {
    let userService: UserService;
    let userRepository: Partial<UserRepository>;
    let genreRepository: Partial<GenreRepository>;
    let shoppingCartRepository: Partial<ShoppingCartRepository>;

    beforeEach(async () => {
        userRepository = {
        findByUId: jest.fn(),
        findById: jest.fn(),
        findByEmail: jest.fn(),
        findAll: jest.fn(),
        save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
            UserService,
            { provide: UserRepository, useValue: userRepository },
            { provide: GenreRepository, useValue: genreRepository },
            { provide: ShoppingCartRepository, useValue: shoppingCartRepository },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        
    });

    describe('getAllUsers', () => {
        it('Success', async () => {
            const mockUser1 = new User();
            mockUser1.id = 1;
            mockUser1.name = 'Mock User 1';
    
            const mockUser2 = new User();
            mockUser2.id = 2;
            mockUser2.name = 'Mock User 2';
    
            const mockUserList: User[] = [mockUser1, mockUser2];
    
            (userRepository.findAll as jest.Mock).mockResolvedValue(mockUserList);
    
            const result = await userService.getAllUsers();
    
            expect(result).toEqual([mockUser1, mockUser2]);
            expect(userRepository.findAll).toHaveBeenCalledWith();
        });
    });

    describe('getAUser', () => {
        it('Success', async () => {
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User 1';
    
            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
    
            const result = await userService.getUserById(1);
    
            expect(result).toEqual(mockUser);
            expect(userRepository.findById).toHaveBeenCalledWith(1);
        });

        it('Fail_UserNotFound', async () => {

            (userRepository.findById as jest.Mock).mockResolvedValue(null);
      
            const err = await userService.getUserById(1).catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with ID 1 not found');
        });
    });

    describe('getUserByToken', () => {
        it('Success', async () => {
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.uid = 'ABcDffRjsAweVyutjnL'
            mockUser.name = 'Mock User 1';
    
            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
    
            const result = await userService.getUserByToken(mockUser.uid);
            
    
            expect(result).toEqual(mockUser);
            expect(userRepository.findByUId).toHaveBeenCalledWith(mockUser.uid);
        });

        it('Fail_UserNotFound', async () => {
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.uid = 'ABcDffRjsAweVyutjnL'
            mockUser.name = 'Mock User 1';

            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
      
            const err = await userService.getUserByToken(mockUser.uid).catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with given UID not found');
        });
    });
});
