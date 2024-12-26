import { Test, TestingModule } from '@nestjs/testing';
import { CommentLikeDislikeRepository } from 'src/app/comment-like-dislike/comment-like-dislike.repository';
import { CommentRepository } from 'src/app/comment/comment.repository';
import { CommentService } from 'src/app/comment/comment.service';
import { CommentNotFoundException } from 'src/app/comment/exceptions/comment-not-found.exception';
import { Comment } from 'src/app/comment/comment.entity';
import { ReviewRepository } from 'src/app/review/review.repository';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { User } from 'src/app/user/user.entity';
import { UserRepository } from 'src/app/user/user.repository';
import { Review } from 'src/app/review/review.entity';
import { ReviewNotFoundException } from 'src/app/review/exceptions/review-not-found.exception';
import { UserUnauthorizedException } from 'src/app/user/exceptions/user-unauthorized.exception';
import { CommentWithLikeDislikeDto } from 'src/app/comment/dtos/comment-with-like-dislike-dto';

describe('CommentService', () => {
    let commentService: CommentService;
    let commentRepository: Partial<CommentRepository>;
    let reviewRepository: Partial<ReviewRepository>;
    let userRepository: Partial<UserRepository>;
    let commentLikeDislikeRepository: Partial<CommentLikeDislikeRepository>;

    beforeEach(async () => {
        commentRepository = {
            GetTenLast: jest.fn(),
            findById: jest.fn(),
            findByReview: jest.fn(),
            findByUser: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        };

        reviewRepository = {
            findById: jest.fn()
        };

        userRepository = {
            findById: jest.fn(),
            findByUId: jest.fn()
        }

        commentLikeDislikeRepository = {
            getLikeCount: jest.fn(),
            getDislikeCount: jest.fn(),
            findByReviewAndUser: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
          providers: [
              CommentService,
              { provide: CommentRepository, useValue: commentRepository },
              { provide: UserRepository, useValue: userRepository },
              { provide: ReviewRepository, useValue: reviewRepository },
              { provide: CommentLikeDislikeRepository, useValue: commentLikeDislikeRepository}
          ],
        }).compile();

        commentService = module.get<CommentService>(CommentService);
    });

    describe('getLastTenComments', () => {
        it('Success_getLastTenComments', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';
            
            let mockCommentList: CommentWithLikeDislikeDto[] = [];

            for (let i = 0; i < 10; i += 1){
                
                const comment = new CommentWithLikeDislikeDto();
                comment.id = i + 1;
                comment.user = mockUser;
                comment.content = undefined;
                comment.dateCreated = undefined;
                comment.dislikeCount = undefined;
                comment.likeCount = undefined;
                comment.review = undefined;
                comment.userChoice = 0;

                mockCommentList.push(comment);

            }

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (commentRepository.GetTenLast as jest.Mock).mockResolvedValue(mockCommentList);

            const result = await commentService.getLastTenComments(1, "1");

            expect(result).toEqual(mockCommentList);
            expect(userRepository.findById).toHaveBeenCalledWith(1);

        });
        
        it('Fail_UserNotFound', async () =>{ 
            (userRepository.findById as jest.Mock).mockResolvedValue(null);
    
            const err = await commentService.getLastTenComments(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with ID 1 not found');
        })

        it('Fail_CommentNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (commentRepository.GetTenLast as jest.Mock).mockResolvedValue(null);
    
            const err = await commentService.getLastTenComments(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(CommentNotFoundException);
            expect(err.message).toContain('Comments by user 1 not found');
        })
    });

    describe('getCommentsByReview', () => {
        it('Success_getCommentsByReview', async () =>{
            const mockReview = new Review();
            mockReview.id = 1;

            const comment1 = new CommentWithLikeDislikeDto();
            comment1.id = 1;
            comment1.review = mockReview;
            comment1.content = undefined;
            comment1.dateCreated = undefined;
            comment1.dislikeCount = undefined;
            comment1.likeCount = undefined;
            comment1.userChoice = 0;

            const comment2 = new CommentWithLikeDislikeDto();
            comment2.id = 2;
            comment2.review = mockReview;
            comment2.content = undefined;
            comment2.dateCreated = undefined;
            comment2.dislikeCount = undefined;
            comment2.likeCount = undefined;
            comment2.userChoice = 0;
            
            let mockCommentList: CommentWithLikeDislikeDto[] = [comment1, comment2];

            (reviewRepository.findById as jest.Mock).mockResolvedValue(mockReview);
            (commentRepository.findByReview as jest.Mock).mockResolvedValue(mockCommentList);

            const result = await commentService.getCommentsByReview(1, "1");

            expect(result).toEqual(mockCommentList);
            expect(reviewRepository.findById).toHaveBeenCalledWith(1);

        });
        
        it('Fail_ReviewNotFound', async () =>{ 
            (reviewRepository.findById as jest.Mock).mockResolvedValue(null);
    
            const err = await commentService.getCommentsByReview(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(ReviewNotFoundException);
            expect(err.message).toContain('Review for ID 1 not found');
        })

        it('Fail_CommentNotFound', async () =>{
            const mockReview = new Review();
            mockReview.id = 1;

            (reviewRepository.findById as jest.Mock).mockResolvedValue(mockReview);
            (commentRepository.findByReview as jest.Mock).mockResolvedValue(null);
    
            const err = await commentService.getCommentsByReview(1, "1").catch(e => e);
            expect(err).toBeInstanceOf(CommentNotFoundException);
            expect(err.message).toContain('Comments for review 1 not found');
        })
    });

    describe('getCommentsByUser', () => {
        it('Success_getCommentsByUser', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const comment1 = new CommentWithLikeDislikeDto();
            comment1.id = 1;
            comment1.user = mockUser;
            comment1.review = undefined;
            comment1.content = undefined;
            comment1.dateCreated = undefined;
            comment1.dislikeCount = undefined;
            comment1.likeCount = undefined;
            comment1.userChoice = 0;

            const comment2 = new CommentWithLikeDislikeDto();
            comment2.id = 2;
            comment2.user = mockUser;
            comment2.review = undefined;
            comment2.content = undefined;
            comment2.dateCreated = undefined;
            comment2.dislikeCount = undefined;
            comment2.likeCount = undefined;
            comment2.userChoice = 0;
            
            let mockCommentList: CommentWithLikeDislikeDto[] = [comment1, comment2];

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (commentRepository.findByUser as jest.Mock).mockResolvedValue(mockCommentList);

            const result = await commentService.getCommentsByUser("1");

            expect(result).toEqual(mockCommentList);
            expect(userRepository.findByUId).toHaveBeenCalledWith("1");

        });
        
        it('Fail_UserNotFound', async () =>{ 
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
  
            const err = await commentService.getCommentsByUser("1").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with given UID not found');
        })

        it('Fail_CommentNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (commentRepository.findByUser as jest.Mock).mockResolvedValue(null);
  
            const err = await commentService.getCommentsByUser("1").catch(e => e);
            expect(err).toBeInstanceOf(CommentNotFoundException);
            expect(err.message).toContain('Comments by user 1 not found');
        })
    });

    describe('addComment', () => {
        it('Success_addComment', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockReview = new Review();
            mockReview.id = 1;

            const expectedResult = new Comment();
            expectedResult.id = 1;
            expectedResult.user = mockUser;
            expectedResult.review = mockReview;
            expectedResult.content = "This is amazing.";

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.findById as jest.Mock).mockResolvedValue(mockReview);
            (commentRepository.save as jest.Mock).mockImplementation((comment: Comment) => {
                comment.id = 1;
                return Promise.resolve(comment);
            });

            const result = await commentService.addComment(1, "1", "This is amazing.");

            expect(result.id).toEqual(expectedResult.id);
            expect(result.user).toEqual(expectedResult.user);
            expect(result.review).toEqual(expectedResult.review);
            expect(result.content).toEqual(expectedResult.content);
            expect(userRepository.findByUId).toHaveBeenCalledWith("1");
            expect(reviewRepository.findById).toHaveBeenCalledWith(1);
            expect(commentRepository.save).toHaveBeenCalledTimes(1);
        })
        
        it('Fail_UserNotFound', async () =>{
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

            const err = await commentService.addComment(1, "1", "This is amazing.").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with given UID not found');
        })

        it('Fail_ReviewNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.findById as jest.Mock).mockResolvedValue(null);

            const err = await commentService.addComment(1, "1", "This is amazing.").catch(e => e);
            expect(err).toBeInstanceOf(ReviewNotFoundException);
            expect(err.message).toContain('Review for ID 1 not found');
        })

        it('Fail_ContentNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockReview = new Review();
            mockReview.id = 1;

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.findById as jest.Mock).mockResolvedValue(mockReview);

            const err = await commentService.addComment(1, "1", null).catch(e => e);
            expect(err).toBeInstanceOf(CommentNotFoundException);
            expect(err.message).toContain('No content has been found');
        })
    });

    describe('deleteReview', () => {
        it('Success_deleteReviewAdmin', async () =>{
            const mockUser = new User();
            mockUser.id = 2;
            mockUser.name = 'Mock User';

            const mockReview = new Review();
            mockReview.id = 1;

            const mockComment = new Comment();
            mockComment.id = 1;
            mockComment.user = mockUser;
            mockComment.review = mockReview;

            const expectedResult = {message: "This comment with ID 1 was removed."};

            (commentRepository.findById as jest.Mock).mockResolvedValue(mockComment);
            (commentRepository.delete as jest.Mock).mockResolvedValue(null);

            const result = await commentService.deleteComment("1", 1, true);

            expect(result).toEqual(expectedResult);
            expect(commentRepository.findById).toHaveBeenCalledWith(1);
        })

        it('Success_deleteReviewSelfUser', async () =>{
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.uid = "1";
            mockUser.name = 'Mock User';

            const mockReview = new Review();
            mockReview.id = 1;

            const mockComment = new Comment();
            mockComment.id = 1;
            mockComment.user = mockUser;
            mockComment.review = mockReview;

            const expectedResult = {message: "This comment with ID 1 was removed."};

            (commentRepository.findById as jest.Mock).mockResolvedValue(mockComment);
            (commentRepository.delete as jest.Mock).mockResolvedValue(null);

            const result = await commentService.deleteComment("1", 1, false);

            expect(result).toEqual(expectedResult);
            expect(commentRepository.findById).toHaveBeenCalledWith(1);
        })

        it('Fail_UserNotAdmin', async () =>{
            const mockUser = new User();
            mockUser.id = 2;
            mockUser.name = 'Mock User';

            const mockComment = new Comment();
            mockComment.id = 1;
            mockComment.user = mockUser;

            (commentRepository.findById as jest.Mock).mockResolvedValue(mockComment);
            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

            const err = await commentService.deleteComment("1", 1, false).catch(e => e);
            expect(err).toBeInstanceOf(UserUnauthorizedException);
            expect(err.message).toContain('Access to this endpoint in an unpermitted way is forbidden');
        })

        it('Fail_CommentNotFound', async () =>{
            const mockUser = new User();
            mockUser.id = 2;
            mockUser.name = 'Mock User';

            const mockReview = new Review();
            mockReview.id = 1;

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (reviewRepository.findById as jest.Mock).mockResolvedValue(mockReview);
            (commentRepository.findById as jest.Mock).mockResolvedValue(null);
    
            const err = await commentService.deleteComment("1", 1, true).catch(e => e);
            expect(err).toBeInstanceOf(CommentNotFoundException);
            expect(err.message).toContain('Comment for ID 1 not found');
        })
    });
})