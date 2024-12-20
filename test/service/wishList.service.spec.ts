import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/app/user/user.entity';
import { UserRepository } from 'src/app/user/user.repository';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { WishListRepository } from 'src/app/wish-list/wish-list.repository';
import { WishListService } from 'src/app/wish-list/wish-list.service';
import { WishList } from 'src/app/wish-list/wish-list.entity';
import { Book } from 'src/app/book/book.entity';
import { BookRepository } from 'src/app/book/book.repository';
import { BookNotFoundException } from 'src/app/book/exceptions/book-not-found.exception';


describe('WishListService', () => {
  let wishListService: WishListService;
  let wishListRepository: Partial<WishListRepository>;
  let userRepository: Partial<UserRepository>;
  let bookRepository: Partial<BookRepository>;

  beforeEach(async () => {
    wishListRepository = {
      findByBookAndUser: jest.fn(),
      findByUser: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };

    userRepository = {
      findByUId: jest.fn(),
      findById: jest.fn()
    };

    bookRepository = {
      findByName: jest.fn(),
      findById: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishListService,
        { provide: WishListRepository, useValue: wishListRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: BookRepository, useValue: bookRepository }
      ],
    }).compile();

    wishListService = module.get<WishListService>(WishListService);
  });

  describe('addItem', () => {
    it('Success', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.barcode = "aaaaa";
      mockBook.bookDimension = "3x3x3";
      mockBook.datePublished = Date.now();
      mockBook.description = "aaaaa";
      mockBook.editionNumber = "3";
      mockBook.genres = [];
      mockBook.imagePath = "";
      mockBook.isDeleted = false;
      mockBook.isbn = "aaaaa";
      mockBook.language = "tr";
      mockBook.name = "aaaaa";
      mockBook.pageNumber = 333;
      mockBook.price = 15;
      mockBook.publisher = mockUser;
      mockBook.writer = "aaaaa";

      const expectedResult = new WishList();
      expectedResult.id = 1;
      expectedResult.user = mockUser;
      expectedResult.book = mockBook;
      expectedResult.dateAdded = new Date();

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
      (wishListRepository.save as jest.Mock).mockImplementation((wish: WishList) => {
        wish.id = 1;
        return Promise.resolve(wish);
      });

      const result = await wishListService.addItem(1, "1");

      expect(result.id).toEqual(expectedResult.id);
      expect(result.user).toEqual(expectedResult.user);
      expect(result.book).toEqual(expectedResult.book);
      expect(result.dateAdded).toEqual(expectedResult.dateAdded);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(1);
      expect(wishListRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      await expect(wishListService.addItem(1, "1")).rejects.toThrow(UserNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });

    it('Fail_BookNotFound', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(wishListService.addItem(1, "1")).rejects.toThrow(BookNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(1);
    });

  });

  describe('getItems', () => {
    it('Success', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockWish1 = new WishList();
      mockWish1.id = 1;
      mockWish1.user = mockUser;
      mockWish1.dateAdded = new Date(new Date().toLocaleDateString());
      
      const mockWish2 = new WishList();
      mockWish2.id = 2;
      mockWish2.user = mockUser;
      mockWish2.dateAdded = new Date(new Date().toLocaleDateString());

      const mockWishList: WishList[] = [mockWish1, mockWish2];
      
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (wishListRepository.findByUser as jest.Mock).mockResolvedValue(mockWishList);

      const result = await wishListService.getItems("1");

      expect(result).toEqual([mockWish1, mockWish2]);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });

    it('Success_Empty', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockWishList: WishList[] = [];
      
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (wishListRepository.findByUser as jest.Mock).mockResolvedValue(mockWishList);

      const result = await wishListService.getItems("1");

      expect(result).toEqual([]);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });

    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
  
      const err = await wishListService.getItems("1").catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
      expect(err.message).toContain('User with given UID not found');
    });
  });
});
