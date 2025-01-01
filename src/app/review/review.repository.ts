import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./review.entity";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(private readonly  dataSource: DataSource) {
        super(Review, dataSource.createEntityManager());
    }
  
    async findByBookAndUser(bookId: number, userId: number): Promise<Review | undefined> {
        return this.createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .leftJoin('review.book', 'book')
        .where('book.id = :i_book', { i_book: bookId })
        .andWhere('user.id = :i_user', { i_user: userId })
        .getOne();
    }
    
    async findByBook(bookId: number): Promise<Review[]> {
        return this.createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoin('review.book', 'book')
        .where('book.id = :i_book', {i_book: bookId})
        .getMany();
    }

    async GetTenLast(userId: number): Promise<Review[]> {
        return this.createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .leftJoinAndSelect('review.book', 'book')
        .where('user.id = :i_user', {i_user: userId})
        .orderBy('review.dateCreated', 'DESC')
        .take(10)
        .getMany();
    }
    
    async findById(reviewId: number): Promise<Review | undefined> {
        return this.createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .leftJoin('review.book', 'book')
        .where('review.id = :i_review', {i_review: reviewId})
        .getOne();
    }
    
    async findByUser(userId: number): Promise<Review[]> {
        return this.createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .leftJoin('review.book', 'book')
        .where('user.id = :i_user', {i_user: userId})
        .getMany();
    }

    async findByLikeCountAndUser(userId: number): Promise<Review[]> {
        return this.createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .where('user.id = :i_user', {i_user: userId})
        .leftJoin('review_like_dislike', 'review_like_dislike', 'review.id = review_like_dislike.review_id')
        .addSelect('SUM (CASE WHEN review_like_dislike.likeDislike = 1 THEN 1 ELSE 0 END)', 'like_count')
        .groupBy('review.id')
        .addGroupBy('user.id')
        .orderBy('like_count', 'DESC')
        .addOrderBy('review.dateCreated', 'DESC')
        .getMany();
    }
    
    async findAverageReviewScoreByBook(bookId: number): Promise<number | undefined> {
        const result = await this.createQueryBuilder('review')
        .leftJoin('review.book', 'book')
        .select('AVG(review.score)', 'averageScore')
        .where('book.id = :i_book', { i_book: bookId })
        .getRawOne();
    
        return result?.averageScore ? parseFloat(result.averageScore) : null;
    }

    async findAll(): Promise<Review[]> {
    
        return await this.find({
            relations: ['book', 'user'],
        });
            
    }

}