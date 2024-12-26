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


describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: Partial<BookRepository>;
  let userRepository: Partial<UserRepository>;
  let genreRepository: Partial<GenreRepository>;

  beforeEach(async () => {

    bookRepository = {
      findByName: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn()
    };

    userRepository = {
      findById: jest.fn(),
      findByUId: jest.fn(),
    };

    genreRepository = {
      findAll: jest.fn(),
      findGenre: jest.fn(),
    };

    // Create Testing Module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: BookRepository, useValue: bookRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: GenreRepository, useValue: genreRepository },
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

      (bookRepository.findAll as jest.Mock).mockResolvedValue(mockBookList);

      const result = await bookService.getAllBooks();

      expect(result).toEqual(mockBookList);
      expect(bookRepository.findAll).toHaveBeenCalledWith();
    
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

  // Testing for deleteBook will be added!

});
