import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/app/user/user.module';
import { BookModule } from '../src/app/book/book.module';
import { CustomerAddressModule } from '../src/app/customer-address/customer-address.module';
import { FriendRequestModule } from '../src/app/friend-request/friend-request.module';
import { ReadStatusModule } from '../src/app/read-status/read-status.module';
import { GenreModule } from '../src/app/genre/genre.module';
import { WishListModule } from '../src/app/wish-list/wish-list.module';
import { ReviewModule } from '../src/app/review/review.module';
import { ReviewLikeDislikeModule } from '../src/app/review-like-dislike/review-like-dislike.module';
import { CommentModule } from '../src/app/comment/comment.module';
import { CommentLikeDislikeModule } from '../src/app/comment-like-dislike/comment-like-dislike.module';
import { DiscountModule } from '../src/app/discount/discount.module';
import { CouponModule } from '../src/app/coupon/coupon.module';
import { ShoppingCartModule } from '../src/app/shopping-cart/shopping-cart.module';
import { CartItemModule } from '../src/app/cart-item/cart-item.module';
import { OrderModule } from '../src/app/order/order.module';
import { OrderItemModule } from '../src/app/order-item/order-item.module';
import { ConfigModule } from '@nestjs/config'
import { AuthGuard } from '../src/guards/auth.guard';
import { EmailModule } from '../src/mailer/email.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',  // Hard-coded values
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'test_db',
      entities: [__dirname + '/../src/app/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    BookModule,
    CustomerAddressModule,
    FriendRequestModule,
    ReadStatusModule,
    GenreModule,
    WishListModule,
    ReviewModule,
    ReviewLikeDislikeModule,
    CommentModule,
    CommentLikeDislikeModule,
    DiscountModule,
    CouponModule,
    ShoppingCartModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    EmailModule,
  ],
  providers: [AuthGuard],
})
export class TestModule {}