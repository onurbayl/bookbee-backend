import { Test, TestingModule } from '@nestjs/testing';
import { Book } from 'src/app/book/book.entity';
import { BookRepository } from 'src/app/book/book.repository';
import { BookNotFoundException } from 'src/app/book/exceptions/book-not-found.exception';
import { Discount } from 'src/app/discount/discount.entity';
import { DiscountRepository } from 'src/app/discount/discount.repository';
import { DiscountService } from 'src/app/discount/discount.service';
import { createNewDiscountDto } from 'src/app/discount/dtos/create-new-discount-dto';
import { DiscountInvalidDataException } from 'src/app/discount/exceptions/discount-invalid-data.exception';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { UserUnauthorizedException } from 'src/app/user/exceptions/user-unauthorized.exception';
import { User } from 'src/app/user/user.entity';
import { UserRepository } from 'src/app/user/user.repository';

describe('DiscountService', () => {
  let discountService: DiscountService;
  let discountRepository: Partial<DiscountRepository>;
  let userRepository: Partial<UserRepository>;
  let bookRepository: Partial<BookRepository>;

  beforeEach(async () => {
    discountRepository = {
      findOverlapByBook: jest.fn(),
      findActiveByBook: jest.fn(),
      save: jest.fn(),
    };

    userRepository = {
      findByUId: jest.fn(),
    };

    bookRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountService,
        { provide: DiscountRepository, useValue: discountRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: BookRepository, useValue: bookRepository },
      ],
    }).compile();

    discountService = module.get<DiscountService>(DiscountService);
  });

  describe('getCouponsForUser', () => {
    it('Success', async () => {
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';

        const mockBook = new Book();
        mockBook.id = 1;
        mockBook.publisher = mockUser;

        const mockInput = new createNewDiscountDto();
        mockInput.bookId = 1;
        mockInput.discountPercentage = 15;
        mockInput.startDate = new Date('2026-12-12');
        mockInput.endDate = new Date('2028-12-12');

        const expectedResult = new Discount();
        expectedResult.id = 1;
        expectedResult.book = mockBook;
        expectedResult.discountPercentage = 15;
        expectedResult.startDate = mockInput.startDate;
        expectedResult.endDate = mockInput.endDate;

        const mockOverlapList: Discount[] = [];

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
        (discountRepository.findOverlapByBook as jest.Mock).mockResolvedValue(mockOverlapList);
        (discountRepository.save as jest.Mock).mockImplementation((discount: Discount) => {
          discount.id = 1;
          return Promise.resolve(discount);
        });

        const result = await discountService.addDiscountToDatabase(mockInput, "1");

        expect(result).toEqual(expectedResult);
        expect(userRepository.findByUId).toHaveBeenCalledWith("1");
        expect(bookRepository.findById).toHaveBeenCalledWith(1);
        expect(discountRepository.findOverlapByBook).toHaveBeenCalledWith(1, mockInput.startDate, mockInput.endDate);
    });

    it('Fail_DiscountInvalidDataException_byMissingData', async () => {
      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.endDate = new Date('2028-12-12');

      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(DiscountInvalidDataException);
      expect(err.message).toContain('Some input data is missing in discount form');
    });

    it('Fail_UserNotFoundException_byUId', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.discountPercentage = 15;
      mockInput.startDate = new Date('2026-12-12');
      mockInput.endDate = new Date('2028-12-12');

      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
      expect(err.message).toContain('User with given UID not found');
    });

    it('Fail_BookNotFoundException_byId', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.discountPercentage = 15;
      mockInput.startDate = new Date('2026-12-12');
      mockInput.endDate = new Date('2028-12-12');

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(null);

      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(BookNotFoundException);
      expect(err.message).toContain('Book with ID 1 not found');
    });

    it('Fai_UserUnauthorizedException_byNotOwnBook', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockUser2 = new User();
      mockUser.id = 2;
      mockUser.name = 'Mock User';

      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.publisher = mockUser2;

      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.discountPercentage = 15;
      mockInput.startDate = new Date('2026-12-12');
      mockInput.endDate = new Date('2028-12-12');

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);

      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(UserUnauthorizedException);
      expect(err.message).toContain('The current publisher user does not own the book');
    });

    it('Fail_DiscountInvalidDataException_byStartDate', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.publisher = mockUser;

      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.discountPercentage = 15;
      mockInput.startDate = new Date('2020-12-12');
      mockInput.endDate = new Date('2028-12-12');

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);

      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(DiscountInvalidDataException);
      expect(err.message).toContain('In discount, the start date should not be in the past');
    });

    it('Fail_DiscountInvalidDataException_byEndDate', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.publisher = mockUser;

      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.discountPercentage = 15;
      mockInput.startDate = new Date('2026-12-12');
      mockInput.endDate = new Date('2020-12-12');

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);

      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(DiscountInvalidDataException);
      expect(err.message).toContain('In discount, the end date should not be in the past');
    });

    it('Fail_DiscountInvalidDataException_byEndDate', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.publisher = mockUser;

      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.discountPercentage = 15;
      mockInput.startDate = new Date('2028-12-12');
      mockInput.endDate = new Date('2026-12-12');

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);

      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(DiscountInvalidDataException);
      expect(err.message).toContain('In discount, the end date should not be before the start date');
    });

    it('Fail_DiscountInvalidDataException_byDiscountPercentage', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.publisher = mockUser;

      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.discountPercentage = 1500;
      mockInput.startDate = new Date('2026-12-12');
      mockInput.endDate = new Date('2028-12-12');

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);

      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(DiscountInvalidDataException);
      expect(err.message).toContain('In discount, the discount percentage should be between 5 to 100, given value: 1500');
    });

    it('Fail_DiscountInvalidDataException_byOverlappingDiscount', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';
  
      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.publisher = mockUser;
  
      const mockInput = new createNewDiscountDto();
      mockInput.bookId = 1;
      mockInput.discountPercentage = 15;
      mockInput.startDate = new Date('2026-12-12');
      mockInput.endDate = new Date('2028-12-12');
  
      const expectedResult = new Discount();
      expectedResult.id = 1;
      expectedResult.book = mockBook;
      expectedResult.discountPercentage = 15;
      expectedResult.startDate = mockInput.startDate;
      expectedResult.endDate = mockInput.endDate;
  
      const expectedResult2 = new Discount();
      const mockOverlapList: Discount[] = [expectedResult2];
  
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
      (discountRepository.findOverlapByBook as jest.Mock).mockResolvedValue(mockOverlapList);
  
      const err = await discountService.addDiscountToDatabase(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(DiscountInvalidDataException);
      expect(err.message).toContain('The new discount overlaps with a existing one');
    });

  });

  describe('getCouponsForUser', () => {
    it('Success', async () => {

      const mockBook = new Book();
      mockBook.id = 1;

      const expectedResult = new Discount();
      expectedResult.id = 1;

      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
      (discountRepository.findActiveByBook as jest.Mock).mockResolvedValue(expectedResult);

      const result = await discountService.getActiveDiscountForBook(1);

      expect(result).toEqual(expectedResult);
      expect(bookRepository.findById).toHaveBeenCalledWith(1);
      expect(discountRepository.findActiveByBook).toHaveBeenCalledWith(1);
    });

    it('Fail_BookNotFound', async () => {

      const mockBook = new Book();
      mockBook.id = 1;

      const expectedResult = new Discount();
      expectedResult.id = 1;

      (bookRepository.findById as jest.Mock).mockResolvedValue(null);

      const err = await discountService.getActiveDiscountForBook(1).catch(e => e);
      expect(err).toBeInstanceOf(BookNotFoundException);
      expect(err.message).toContain('Book with ID 1 not found');
    });

  });

});
