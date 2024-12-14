import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { BookModule } from './app/book/book.module';
import { CustomerAddressModule } from './app/customer-address/customer-address.module';
import { FriendRequestModule } from './app/friend-request/friend-request.module';
import { ReadStatusModule } from './app/read-status/read-status.module';
import { GenreModule } from './app/genre/genre.module';
import { WishListModule } from './app/wish-list/wish-list.module';
import { ReviewModule } from './app/review/review.module';
import { ReviewLikeDislikeModule } from './app/review-like-dislike/review-like-dislike.module';
import { CommentModule } from './app/comment/comment.module';
import { CommentLikeDislikeModule } from './app/comment-like-dislike/comment-like-dislike.module';
import { DiscountModule } from './app/discount/discount.module';
import { CouponModule } from './app/coupon/coupon.module';
import { ShoppingCartModule } from './app/shopping-cart/shopping-cart.module';
import { CartItemModule } from './app/cart-item/cart-item.module';
import { OrderModule } from './app/order/order.module';
import { OrderItemModule } from './app/order-item/order-item.module';
import { ConfigModule } from '@nestjs/config'
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'bookbee_backend_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true, // This enables SQL query logging
    }),
    ConfigModule.forRoot(),
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
  ],
  providers: [AuthGuard],
})
export class AppModule {}