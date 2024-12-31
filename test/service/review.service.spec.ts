import { Test, TestingModule } from '@nestjs/testing';
import { Book } from 'src/app/book/book.entity';
import { BookRepository } from 'src/app/book/book.repository';
import { BookNotFoundException } from 'src/app/book/exceptions/book-not-found.exception';
import { ReviewLikeDislikeRepository } from 'src/app/review-like-dislike/review-like-dislike.repository';
import { ReviewWithLikeDislikeDto } from 'src/app/review/dtos/review-with-like-dislike-dto';
import { ReviewBadRequestException } from 'src/app/review/exceptions/review-bad-request.exception';
import { ReviewNotFoundException } from 'src/app/review/exceptions/review-not-found.exception';
import { Review } from 'src/app/review/review.entity';
import { ReviewRepository } from 'src/app/review/review.repository';
import { ReviewService } from 'src/app/review/review.service';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { UserUnauthorizedException } from 'src/app/user/exceptions/user-unauthorized.exception';
import { User } from 'src/app/user/user.entity';
import { UserRepository } from 'src/app/user/user.repository';

describe('ReviewService', () => {
    let reviewService: ReviewService;
    let reviewRepository: Partial<ReviewRepository>;
    let bookRepository: Partial<BookRepository>;
    let userRepository: Partial<UserRepository>;
    let reviewLikeDislikeRepository: Partial<ReviewLikeDislikeRepository>;

    beforeEach(async () => {
        reviewRepository = {
            findByBookAndUser: jest.fn(),
            findByBook: jest.fn(),
            GetTenLast: jest.fn(),
            findById: jest.fn(),
            findByUser: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findByLikeCountAndUser: jest.fn(),
        };

        bookRepository = {
            findById: jest.fn()
        };

        userRepository = {
            findById: jest.fn(),
            findByUId: jest.fn()
        }

        reviewLikeDislikeRepository = {
            getLikeCount: jest.fn(),
            getDislikeCount: jest.fn(),
            findByReviewAndUser: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
          providers: [
              ReviewService,
              { provide: ReviewRepository, useValue: reviewRepository },
              { provide: UserRepository, useValue: userRepository },
              { provide: BookRepository, useValue: bookRepository },
              { provide: ReviewLikeDislikeRepository, useValue: reviewLikeDislikeRepository}
          ],
        }).compile();

        reviewService = module.get<ReviewService>(ReviewService);
    });

    describe('getLastTenReviews', () => {
        it('Success_getLastTenReviews', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.uid = "1";
            mockUser.name = 'Mock User';
            
            let mockReviewList: ReviewWithLikeDislikeDto[] = [];

            for (let i = 0; i < 10; i += 1){
                
                const review = new ReviewWithLikeDislikeDto();
                review.book = undefined;
                review.content = undefined;
                review.dateCreated = undefined;
                review.dislikeCount = undefined;
                review.id = i + 1;
                review.likeCount = undefined;
                review.score = undefined;
                review.user = mockUser;
                review.userChoice = 0;

                mockReviewList.push(review);

            }

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.GetTenLast as jest.Mock).mockResolvedValue(mockReviewList);

            const result = await reviewService.getLastTenReviews(1, "1");

            expect(result).toEqual(mockReviewList);
            expect(userRepository.findById).toHaveBeenCalledWith(1);

        });
        
        it('Fail_UserNotFound', async () =>{ 
            (userRepository.findById as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getLastTenReviews(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with ID 1 not found');
        })

        it('Fail_ReviewNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.GetTenLast as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getLastTenReviews(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(ReviewNotFoundException);
            expect(err.message).toContain('Reviews by user 1 not found');
        })
    });

    describe('getReviewsByBook', () => {
        it('Success_getReviewsByBook', async () =>{
            const mockBook = new Book();
            mockBook.id = 1;

            const review1 = new ReviewWithLikeDislikeDto();
            review1.id = 1;
            review1.book = mockBook;
            review1.content = undefined;
            review1.dateCreated = undefined;
            review1.dislikeCount = undefined;
            review1.likeCount = undefined;
            review1.score = undefined;
            review1.user = undefined;
            review1.userChoice = 0;

            const review2 = new ReviewWithLikeDislikeDto();
            review2.id = 2;
            review2.book = mockBook;
            review2.content = undefined;
            review2.dateCreated = undefined;
            review2.dislikeCount = undefined;
            review2.likeCount = undefined;
            review2.score = undefined;
            review2.user = undefined;
            review2.userChoice = 0;
            
            let mockReviewList: ReviewWithLikeDislikeDto[] = [review1, review2];
            
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBook as jest.Mock).mockResolvedValue(mockReviewList);

            const result = await reviewService.getReviewsByBook(1, "1");

            expect(result).toEqual(mockReviewList);
            expect(bookRepository.findById).toHaveBeenCalledWith(1);

        });
        
        it('Fail_BookNotFound', async () =>{ 
            (bookRepository.findById as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getReviewsByBook(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(BookNotFoundException);
            expect(err.message).toContain('Book with ID 1 not found');
        })

        it('Fail_ReviewNotFound', async () =>{
            const mockBook = new Book();
            mockBook.id = 1;

            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBook as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getReviewsByBook(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(ReviewNotFoundException);
            expect(err.message).toContain('Reviews at book 1 not found');
        })
    });

    describe('getReviewsByUser', () => {
        it('Success_getReviewsByUser', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const review1 = new ReviewWithLikeDislikeDto();
            review1.id = 1;
            review1.user = mockUser;
            review1.content = undefined;
            review1.dateCreated = undefined;
            review1.dislikeCount = undefined;
            review1.likeCount = undefined;
            review1.score = undefined;
            review1.user = undefined;
            review1.userChoice = 0;

            const review2 = new ReviewWithLikeDislikeDto();
            review2.id = 2;
            review2.user = mockUser;
            review2.content = undefined;
            review2.dateCreated = undefined;
            review2.dislikeCount = undefined;
            review2.likeCount = undefined;
            review2.score = undefined;
            review2.user = undefined;
            review2.userChoice = 0;
            
            let mockReviewList: ReviewWithLikeDislikeDto[] = [review1, review2];

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.findByUser as jest.Mock).mockResolvedValue(mockReviewList);

            const result = await reviewService.getReviewsByUser("1");

            expect(result).toEqual(mockReviewList);
            expect(userRepository.findByUId).toHaveBeenCalledWith("1");

        });
        
        it('Fail_UserNotFound', async () =>{ 
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getReviewsByUser("1").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with given UID not found');
        })

        it('Fail_ReviewNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.findByUser as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getReviewsByUser("1").catch(e => e);
            expect(err).toBeInstanceOf(ReviewNotFoundException);
            expect(err.message).toContain('Reviews by user 1 not found');
        })
    });

    describe('getReview', () => {
        it('Success_getReview', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            const mockReview = new ReviewWithLikeDislikeDto();
            mockReview.id = 1;
            mockReview.user = mockUser;
            mockReview.book = mockBook;
            mockReview.content = undefined;
            mockReview.dateCreated = undefined;
            mockReview.dislikeCount = undefined;
            mockReview.likeCount = undefined;
            mockReview.score = undefined;
            mockReview.user = undefined;
            mockReview.userChoice = 0;

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBookAndUser as jest.Mock).mockResolvedValue(mockReview);

            const result = await reviewService.getReview(1, "1");

            expect(result).toEqual(mockReview);
            expect(userRepository.findByUId).toHaveBeenCalledWith("1");
            expect(bookRepository.findById).toHaveBeenCalledWith(1);
            expect(reviewRepository.findByBookAndUser).toHaveBeenCalledWith(1, 1);

        });
        
        it('Fail_UserNotFound', async () =>{
            const mockBook = new Book();
            mockBook.id = 1;
            
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
  
            const err = await reviewService.getReview(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with given UID not found');
        })

        it('Fail_BookNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getReview(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(BookNotFoundException);
            expect(err.message).toContain('Book with ID 1 not found');
        })

        it('Fail_ReviewNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBookAndUser as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getReview(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(ReviewNotFoundException);
            expect(err.message).toContain('Review for book ID 1 and user ID 1 not found');
        })
    });

    describe('addReview', () => {
        it('Success_addReview', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            const expectedResult = new Review();
            expectedResult.id = 1;
            expectedResult.user = mockUser;
            expectedResult.book = mockBook;
            expectedResult.score = 8;
            expectedResult.content = "This is amazing.";

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBookAndUser as jest.Mock).mockResolvedValue(null);
            (reviewRepository.save as jest.Mock).mockImplementation((review: Review) => {
                review.id = 1;
                return Promise.resolve(review);
            });

            const result = await reviewService.addReview(1, "1", 8, "This is amazing.");

            expect(result.id).toEqual(expectedResult.id);
            expect(result.user).toEqual(expectedResult.user);
            expect(result.book).toEqual(expectedResult.book);
            expect(result.score).toEqual(expectedResult.score);
            expect(result.content).toEqual(expectedResult.content);
            expect(userRepository.findByUId).toHaveBeenCalledWith("1");
            expect(bookRepository.findById).toHaveBeenCalledWith(1);
            expect(reviewRepository.findByBookAndUser).toHaveBeenCalledWith(1, 1);
            expect(reviewRepository.save).toHaveBeenCalledTimes(1);
        })
        
        it('Fail_UserNotFound', async () =>{
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

            const err = await reviewService.addReview(1, "1", 8, "This is amazing.").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with given UID not found');
        })

        it('Fail_BookNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(null);

            const err = await reviewService.addReview(1, "1", 8, "This is amazing.").catch(e => e);
            expect(err).toBeInstanceOf(BookNotFoundException);
            expect(err.message).toContain('Book with ID 1 not found');
        })

        it('Fail_ScoreContentNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);

            const err = await reviewService.addReview(1, "1", null, null).catch(e => e);
            expect(err).toBeInstanceOf(ReviewBadRequestException);
            expect(err.message).toContain('Review does not contain a score or a content');
        })

        it('Fail_InvalidScore', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);

            const err = await reviewService.addReview(1, "1", 15, "This is amazing.").catch(e => e);
            expect(err).toBeInstanceOf(ReviewBadRequestException);
            expect(err.message).toContain('Given score is an invalid value');
        })

        it('Fail_ReviewExists', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            const mockReview = new Review();
            mockReview.id = 1;
            mockReview.user = mockUser;
            mockReview.book = mockBook;

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBookAndUser as jest.Mock).mockResolvedValue(mockReview);

            const err = await reviewService.addReview(1, "1", 8, "This is amazing.").catch(e => e);
            expect(err).toBeInstanceOf(ReviewBadRequestException);
            expect(err.message).toContain('You already reviewed this book');
        })
    });

    describe('deleteReview', () => {
        it('Success_deleteReviewAdmin', async () =>{
            const mockUser = new User();
            mockUser.id = 2;
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            const mockReview = new Review();
            mockReview.id = 1;
            mockReview.user = mockUser;
            mockReview.book = mockBook;

            const expectedResult = {message: "This review by the user 2 was removed."};

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBookAndUser as jest.Mock).mockResolvedValue(mockReview);
            (reviewRepository.delete as jest.Mock).mockResolvedValue(null);

            const result = await reviewService.deleteReview("1", 1, 2, true);

            expect(result).toEqual(expectedResult);
            expect(userRepository.findById).toHaveBeenCalledWith(2);
            expect(bookRepository.findById).toHaveBeenCalledWith(1);
            expect(reviewRepository.findByBookAndUser).toHaveBeenCalledWith(1, 2);
        })

        it('Success_deleteReviewSelfUser', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.uid = "1"
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            const mockReview = new Review();
            mockReview.id = 1;
            mockReview.user = mockUser;
            mockReview.book = mockBook;

            const expectedResult = {message: "This review by the user 1 was removed."};

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBookAndUser as jest.Mock).mockResolvedValue(mockReview);
            (reviewRepository.delete as jest.Mock).mockResolvedValue(null);

            const result = await reviewService.deleteReview("1", 1, 1, false);

            expect(result).toEqual(expectedResult);
            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(bookRepository.findById).toHaveBeenCalledWith(1);
            expect(reviewRepository.findByBookAndUser).toHaveBeenCalledWith(1, 1);
        })

        it('Fail_UserNotFound', async () =>{
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

            const err = await reviewService.deleteReview("1", 1, 2, true).catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with ID 2 not found');
        })

        it('Fail_UserNotAdmin', async () =>{
            const mockUser = new User();
            mockUser.id = 2;
            mockUser.name = 'Mock User';

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

            const err = await reviewService.deleteReview("1", 1, 2, false).catch(e => e);
            expect(err).toBeInstanceOf(UserUnauthorizedException);
            expect(err.message).toContain('Access to this endpoint in an unpermitted way is forbidden');
        })

        it('Fail_BookNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 2;
            mockUser.name = 'Mock User';

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(null);

            const err = await reviewService.deleteReview("1", 1, 2, true).catch(e => e);
            expect(err).toBeInstanceOf(BookNotFoundException);
            expect(err.message).toContain('Book with ID 1 not found');
        })

        it('Fail_ReviewNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 2;
            mockUser.name = 'Mock User';

            const mockBook = new Book();
            mockBook.id = 1;

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
            (reviewRepository.findByBookAndUser as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.deleteReview("1", 1, 2, true).catch(e => e);
            expect(err).toBeInstanceOf(ReviewNotFoundException);
            expect(err.message).toContain('Review for book ID 1 and user ID 2 not found');
        })
    });

    describe('getReviewsByLikeCountAndUser', () => {
        it('Success_getReviewsByLikeCountAndUser', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const review1 = new ReviewWithLikeDislikeDto();
            review1.id = 1;
            review1.user = mockUser;
            review1.content = undefined;
            review1.dateCreated = undefined;
            review1.dislikeCount = undefined;
            review1.likeCount = undefined;
            review1.score = undefined;
            review1.user = undefined;
            review1.userChoice = 0;

            const review2 = new ReviewWithLikeDislikeDto();
            review2.id = 2;
            review2.user = mockUser;
            review2.content = undefined;
            review2.dateCreated = undefined;
            review2.dislikeCount = undefined;
            review2.likeCount = undefined;
            review2.score = undefined;
            review2.user = undefined;
            review2.userChoice = 0;
            
            let mockReviewList: ReviewWithLikeDislikeDto[] = [review1, review2];

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.findByLikeCountAndUser as jest.Mock).mockResolvedValue(mockReviewList);

            const result = await reviewService.getReviewsByLikeCountAndUser("1");

            expect(result).toEqual(mockReviewList);
            expect(userRepository.findByUId).toHaveBeenCalledWith("1");

        });
        
        it('Fail_UserNotFound', async () =>{ 
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getReviewsByLikeCountAndUser("1").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with given UID not found');
        })

        it('Fail_ReviewNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.findByLikeCountAndUser as jest.Mock).mockResolvedValue(null);
  
            const err = await reviewService.getReviewsByLikeCountAndUser("1").catch(e => e);
            expect(err).toBeInstanceOf(ReviewNotFoundException);
            expect(err.message).toContain('Reviews by user 1 not found');
        })
    });

})