import { Test, TestingModule } from '@nestjs/testing';
import { BookRepository } from 'src/app/book/book.repository';
import { UserRepository } from 'src/app/user/user.repository';
import { ReadStatusService } from 'src/app/read-status/read-status.service';
import { ReadStatusRepository } from 'src/app/read-status/read-status.repository';
import { User } from 'src/app/user/user.entity';
import { Book } from 'src/app/book/book.entity';
import { ReadStatus } from 'src/app/read-status/read-status.entity';
import { BookNotFoundException } from 'src/app/book/exceptions/book-not-found.exception';


describe('ReadStatusService', () => {
  let readStatusService: ReadStatusService;
  let readStatusRepository: Partial<ReadStatusRepository>;
  let bookRepository: Partial<BookRepository>;
  let userRepository: Partial<UserRepository>;
  beforeEach(async () => {

    readStatusRepository = {
        getReadStatus: jest.fn(),
    };

    bookRepository = {
        findById: jest.fn(),
    };

    userRepository = {
        findByUId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadStatusService,
        { provide: ReadStatusRepository, useValue: readStatusRepository },
        { provide: BookRepository, useValue: bookRepository },
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    readStatusService = module.get<ReadStatusService>(ReadStatusService);
  });

  describe('findBookByName', () => {
    it('Success_WithoutUser', async () => {

        (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

        const result = await readStatusService.getReadStatusByBook(1, null);

        expect(result.status).toEqual(null);
        expect(userRepository.findByUId).toHaveBeenCalledWith(null);
    });

    it('Success_WithUser', async () => {
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.uid = 'eeee';

        const mockBook = new Book();

        let mockStatus = new ReadStatus();

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
        (readStatusRepository.getReadStatus as jest.Mock).mockResolvedValue(mockStatus);

        mockStatus.status = "Already Read";
        const result1 = await readStatusService.getReadStatusByBook(1, 'eeee');
        expect(result1.status).toEqual(0);

        mockStatus.status = "Reading";
        const result2 = await readStatusService.getReadStatusByBook(1, 'eeee');
        expect(result2.status).toEqual(1);

        mockStatus.status = "Will Read";
        const result3 = await readStatusService.getReadStatusByBook(1, 'eeee');
        expect(result3.status).toEqual(2);

        (readStatusRepository.getReadStatus as jest.Mock).mockResolvedValue(null);

        const result4 = await readStatusService.getReadStatusByBook(1, 'eeee');
        expect(result4.status).toEqual(null);
    });

    it('Fail_BookNotFound', async () => {
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.uid = 'eeee';

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (bookRepository.findById as jest.Mock).mockResolvedValue(null);

        const err = await readStatusService.getReadStatusByBook(1, 'eeee').catch(e => e);
        expect(err).toBeInstanceOf(BookNotFoundException);
        expect(err.message).toContain('Book with ID 1 not found');
    });

  });

});
