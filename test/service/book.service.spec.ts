import { Test, TestingModule } from '@nestjs/testing';
import { BookRepository } from 'src/app/book/book.repository';
import { BookService } from 'src/app/book/book.service';
import { BookNotFoundException } from 'src/app/book/exceptions/book-not-found.exception';
import { UserRepository } from 'src/app/user/user.repository';

describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: Partial<BookRepository>;
  let userRepository: Partial<UserRepository>;

  beforeEach(async () => {
    // Mock Repositories
    bookRepository = {
      findByName: jest.fn(),
    };

    userRepository = {
      findById: jest.fn(),
    };

    // Create Testing Module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: BookRepository, useValue: bookRepository },
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
  });

  //For each method
  describe('findBookByName', () => {
    it('Success', async () => {
        //Create mock object you are going to use.
        const mockBook = { id: 1, name: 'Test Book' };

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

    //Add more tests

  });
});
