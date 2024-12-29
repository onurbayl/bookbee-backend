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
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './mailer/email.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true, // This enables SQL query logging
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
export class AppModule {}