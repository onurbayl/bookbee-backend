import { Test, TestingModule } from '@nestjs/testing';
import { Book } from 'src/app/book/book.entity';
import { BookRepository } from 'src/app/book/book.repository';
import { BookService } from 'src/app/book/book.service';
import { BookNotFoundException } from 'src/app/book/exceptions/book-not-found.exception';
import { InvalidBookInputException } from 'src/app/book/exceptions/invalid-book-input.exception';
import { RestrictedBookOpException } from 'src/app/book/exceptions/restricted-book-op.exception';
import { createNewBookDto } from 'src/app/book/dtos/create-new-book-dto';
import { User } from 'src/app/user/user.entity';
import { UserRepository } from 'src/app/user/user.repository';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { GenreRepository } from 'src/app/genre/genre.repository';
import { Genre } from "src/app/genre/genre.entity";
import { DiscountRepository } from 'src/app/discount/discount.repository';
import { ReviewRepository } from 'src/app/review/review.repository';
import { WishListRepository } from 'src/app/wish-list/wish-list.repository';
import { bookWithDetailDTO } from 'src/app/book/dtos/book-with-detail-dto';


describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: Partial<BookRepository>;
  let userRepository: Partial<UserRepository>;
  let genreRepository: Partial<GenreRepository>;
  let discountRepository: Partial<DiscountRepository>;
  let reviewRepository: Partial<ReviewRepository>;
  let wishListRepository: Partial<WishListRepository>

  beforeEach(async () => {

    bookRepository = {
      findByName: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByPublisher: jest.fn(),
      save: jest.fn(),
      update: jest.fn()
    };

    userRepository = {
      findById: jest.fn(),
      findByUId: jest.fn(),
    };

    genreRepository = {
      findAll: jest.fn(),
      findGenre: jest.fn(),
    };

    discountRepository = {
      findByBook: jest.fn(),
    };

    reviewRepository = {
      findAverageReviewScoreByBook: jest.fn(),
    };

    wishListRepository = {
      countByBook: jest.fn(),
    };

    // Create Testing Module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: BookRepository, useValue: bookRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: GenreRepository, useValue: genreRepository },
        { provide: DiscountRepository, useValue: discountRepository },
        { provide: ReviewRepository, useValue: reviewRepository },
        { provide: WishListRepository, useValue: wishListRepository },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
  });

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.name = 'Mock User';
  mockUser.uid = 'Mock uId';

  const mockGenre = new Genre();
  mockGenre.id = 1;
  mockGenre.name = "Mock Genre";

  const mockBook = new Book(); 
  const mockGenreList: Genre[] = [mockGenre];

  mockBook.id = 1;
  mockBook.name = 'Test Book';
  mockBook.description = 'This is a test book description.';
  mockBook.price = 19.99;
  mockBook.publisher = mockUser; 
  mockBook.genres = mockGenreList; 
  mockBook.writer = 'John Doe';
  mockBook.pageNumber = 250;
  mockBook.datePublished = 2023;
  mockBook.language = 'English';
  mockBook.bookDimension = '15x23cm';
  mockBook.barcode = '1234567890123';
  mockBook.isbn = '978-123-456789-0';
  mockBook.editionNumber = '1st Edition';
  mockBook.imagePath = 'path/to/image.jpg';
  mockBook.isDeleted = false;

  const mockCreateNewBookDto: createNewBookDto = {
    name: 'Test Book',
    description: 'This is a test book description.',
    price: 19.99,
    writer: 'John Doe',
    pageNumber: 250,
    datePublished: 2023,
    language: 'English',
    bookDimension: '15x23cm',
    barcode: '1234567890123',
    isbn: '978-123-456789-0',
    editionNumber: '1st Edition',
    imagePath: 'path/to/image.jpg',
    genres: [1], 
  };

  const mockBookWithDetailDto: bookWithDetailDTO = {
    id: 1,
    averageReviewScore: null,
    discountPercentage: 0,
    finalPrice: 19.99,
    wishlistNumber: null,
    publisher: mockUser,
    name: 'Test Book',
    description: 'This is a test book description.',
    price: 19.99,
    writer: 'John Doe',
    pageNumber: 250,
    datePublished: 2023,
    language: 'English',
    bookDimension: '15x23cm',
    barcode: '1234567890123',
    isbn: '978-123-456789-0',
    editionNumber: '1st Edition',
    imagePath: 'path/to/image.jpg',
    genres: [mockGenre], 
    isDeleted: false
  };

  describe('findBookByName', () => {
    it('Success', async () => {
    
        //Mock Repository accesses
        (bookRepository.findByName as jest.Mock).mockResolvedValue(mockBook);

        //Call service function
        const result = await bookService.findBookByName('Test Book');

        //Test for expected and real results
        expect(result).toEqual(mockBook);
        expect(bookRepository.findByName).toHaveBeenCalledWith('Test Book');
    });

    it('Fail_BookNotFound', async () => {

        //Fail cases are similar to Success

        (bookRepository.findByName as jest.Mock).mockResolvedValue(null);

        //You need to catch exception
        await expect(bookService.findBookByName('elma')).rejects.toThrow(BookNotFoundException);
        expect(bookRepository.findByName).toHaveBeenCalledWith('elma');
    });
  });

  describe('findBookById', () => {
    it('Success', async () => {

        (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);

        const result = await bookService.findBookById(1);

        expect(result).toEqual(mockBook);
        expect(bookRepository.findById).toHaveBeenCalledWith(1);
    });

    it('Fail_BookNotFound', async () => {

        (bookRepository.findById as jest.Mock).mockResolvedValue(null);

        await expect(bookService.findBookById(1)).rejects.toThrow(BookNotFoundException);
        expect(bookRepository.findById).toHaveBeenCalledWith(1);
    });

  });

  describe('getAllBooks', () => {
    it('Success', async () => {

      const mockBookList: Book[] = [];
      const mockBook2 = { ...mockBook }; 
      mockBook2.id = 2; 
      mockBookList.push(mockBook);
      mockBookList.push(mockBook2);

      let num: number = 4;

      (bookRepository.findAll as jest.Mock).mockResolvedValue(mockBookList);
      (reviewRepository.findAverageReviewScoreByBook as jest.Mock).mockImplementation((item) => {
        num++;
        return num;
      });
      (discountRepository.findByBook as jest.Mock).mockResolvedValue(null);

      const result = await bookService.getAllBooks();

      expect(result[0].id).toEqual(2);
      expect(result[1].id).toEqual(1);
      expect(result[0].averageReviewScore).toEqual(6);
      expect(result[1].averageReviewScore).toEqual(5);
      expect(bookRepository.findAll).toHaveBeenCalledWith();
      expect(reviewRepository.findAverageReviewScoreByBook).toHaveBeenCalledTimes(2);
      expect(discountRepository.findByBook).toHaveBeenCalledTimes(2);
    
    });
  });

  describe('getAllBooksWishlist', () => {
    it('Success', async () => {

      const mockBookList: Book[] = [];
      const mockBook2 = { ...mockBook }; 
      mockBook2.id = 2; 
      mockBookList.push(mockBook);
      mockBookList.push(mockBook2);

      let num: number = 4;

      (bookRepository.findAll as jest.Mock).mockResolvedValue(mockBookList);
      (wishListRepository.countByBook as jest.Mock).mockImplementation((item) => {
        num++;
        return num;
      });
      (discountRepository.findByBook as jest.Mock).mockResolvedValue(null);

      const result = await bookService.getAllBooksWishlist();

      expect(result[0].id).toEqual(2);
      expect(result[1].id).toEqual(1);
      expect(result[0].wishlistNumber).toEqual(6);
      expect(result[1].wishlistNumber).toEqual(5);
      expect(bookRepository.findAll).toHaveBeenCalledWith();
      expect(reviewRepository.findAverageReviewScoreByBook).toHaveBeenCalledTimes(2);
      expect(wishListRepository.countByBook).toHaveBeenCalledTimes(2);
      expect(discountRepository.findByBook).toHaveBeenCalledTimes(2);
    
    });
  });

  describe('findPublisherBooks', () => {
    it('Success', async () => {
      const mockBookList: Book[] = [];
      mockBookList.push(mockBook);

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findByPublisher as jest.Mock).mockResolvedValue(mockBookList);
      (discountRepository.findByBook as jest.Mock).mockResolvedValue(null);
      (reviewRepository.findAverageReviewScoreByBook as jest.Mock).mockResolvedValue(null);

      const result = await bookService.findPublisherBooks("1");
      const mockDTOs: bookWithDetailDTO[] = [];
      mockDTOs.push(mockBookWithDetailDto);
      const expectedResult = mockDTOs;

      expect(result).toEqual(expectedResult);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findByPublisher).toHaveBeenCalledWith(mockUser.id);
    });

    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      await expect(bookService.findPublisherBooks("1")).rejects.toThrow(UserNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });
  });

  describe('uploadBook', () => {
    it('Success', async () => {

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (genreRepository.findGenre as jest.Mock).mockResolvedValue(mockGenre);
      (bookRepository.save as jest.Mock).mockImplementation((mockBook: Book) => {
        mockBook.id = 1;
        return Promise.resolve(mockBook);
      }); 

      const result = await bookService.uploadBook(mockCreateNewBookDto , mockUser.uid);

      expect(result).toEqual(mockBook);
    
    });

    // Other situations for uploadBook will be added!

  });

  describe('findPublisherBookById', () => {
    it('Success', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
      const result = await bookService.findPublisherBookById(mockBook.id, "1");
      expect(result).toEqual(mockBook);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(mockBook.id);
    });
    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      await expect(bookService.findPublisherBookById(mockBook.id, "1")).rejects.toThrow(UserNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });
    it('Fail_BookNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(bookService.findPublisherBookById(mockBook.id, "1")).rejects.toThrow(BookNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(mockBook.id);
    });
    it('Fail_NotOwnsBook', async () => {
      const mockUser2 = new User();
      mockUser2.id = 2;
      const mockBook2 = { ...mockBook }; 
      mockBook2.id = 2; 
      mockBook2.publisher = mockUser2;
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook2);
      await expect(bookService.findPublisherBookById(mockBook2.id, "1")).rejects.toThrow(RestrictedBookOpException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(mockBook2.id);
    });
  });

  describe('findDeletedPublisherBooks', () => {
    it('Success', async () => {
      const mockBookList: Book[] = [];
      const mockBook2 = { ...mockBook }; 
      mockBook2.id = 2; 
      mockBook2.isDeleted = true;
      const mockBook3 = { ...mockBook }; 
      mockBook3.id = 3; 
      mockBookList.push(mockBook2);
      mockBookList.push(mockBook3);

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findByPublisher as jest.Mock).mockResolvedValue(mockBookList);
      (discountRepository.findByBook as jest.Mock).mockResolvedValue(null);
      (reviewRepository.findAverageReviewScoreByBook as jest.Mock).mockResolvedValue(null);

      const result = await bookService.findDeletedPublisherBooks("1");
      const mockDTOs: bookWithDetailDTO[] = [];
      const mockBookWithDetailDto2 = { ...mockBookWithDetailDto }; 
      mockBookWithDetailDto2.id = 2;
      mockBookWithDetailDto2.isDeleted = true;
      mockDTOs.push(mockBookWithDetailDto2);
      const expectedResult = mockDTOs;

      expect(result).toEqual(expectedResult);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findByPublisher).toHaveBeenCalledWith(mockUser.id);
    });
    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      await expect(bookService.findDeletedPublisherBooks("1")).rejects.toThrow(UserNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });
  });

  
  describe('reuploadBook', () => {
    it('Success', async () => {
      const mockBook2 = { ...mockBook }; 
      mockBook2.id = 2;
      mockBook2.isDeleted = true; 
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook2);
      const result = await bookService.reuploadBook(mockBook2.id, "1");
      const expectedResult = "The book with ID 2 is reuploaded.";
      expect(result).toEqual(expectedResult);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(mockBook2.id);
    });
    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      await expect(bookService.reuploadBook(mockBook.id, "1")).rejects.toThrow(UserNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });
    it('Fail_BookNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(bookService.reuploadBook(mockBook.id, "1")).rejects.toThrow(BookNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(mockBook.id);
    });
    it('Fail_NotOwnsBook', async () => {
      const mockUser2 = new User();
      mockUser2.id = 2;
      const mockBook2 = { ...mockBook }; 
      mockBook2.id = 2; 
      mockBook2.publisher = mockUser2;
      mockBook2.isDeleted = true;
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook2);
      await expect(bookService.reuploadBook(mockBook2.id, "1")).rejects.toThrow(RestrictedBookOpException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(mockBook2.id);
    });
    it('Fail_NotDeleted', async () => {
      const mockBook2 = { ...mockBook }; 
      mockBook2.id = 2; 
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook2);
      await expect(bookService.reuploadBook(mockBook2.id, "1")).rejects.toThrow(InvalidBookInputException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(bookRepository.findById).toHaveBeenCalledWith(mockBook2.id);
    });
  });

  // Testing for deleteBook will be added!

});
