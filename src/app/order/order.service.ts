import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderRepository } from "./order.repository";
import { UserRepository } from "../user/user.repository";
import { ShoppingCartRepository } from "../shopping-cart/shopping-cart.repository";
import { CartItemRepository } from "../cart-item/cart-item.repository";
import { DiscountRepository } from "../discount/discount.repository";
import { CouponRepository } from "../coupon/coupon.repository";
import { OrderItemRepository } from "../order-item/order-item.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { ShoppingCartNotFoundException } from "../shopping-cart/exceptions/shopping-cart-not-found.exception";
import { OrderItem } from "../order-item/order-item.entity";
import { Discount } from "../discount/discount.entity";
import { CustomerAddressRepository } from "../customer-address/customer-address.repository";
import { CustomerAddressNotFoundException } from "../customer-address/exceptions/customer-address-not-found.exception";
import { createNewOrderDto } from "./dtos/create-new-order-dto";
import { Coupon } from "../coupon/coupon.entity";
import { CouponInvalidDataException } from "../coupon/exceptions/coupon-invalid-data.exception";
import { Order } from "./order.entity";
import { DataSource } from "typeorm";
import { UserBadRequestException } from "../user/exceptions/user-bad-request.exception";
import { OrderBadRequestException } from "./exceptions/order-bad-request.exception";
import { User } from "../user/user.entity";
import { CartItem } from "../cart-item/cart-item.entity";

@Injectable()
export class OrderService {
    constructor(
        private readonly dataSource: DataSource,

        @InjectRepository(OrderRepository)
        private readonly orderRepository: OrderRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(ShoppingCartRepository)
        private readonly shoppingCartRepository: ShoppingCartRepository,

        @InjectRepository(CustomerAddressRepository)
        private readonly customerAddressRepository: CustomerAddressRepository,

        @InjectRepository(CartItemRepository)
        private readonly cartItemRepository: CartItemRepository,

        @InjectRepository(DiscountRepository)
        private readonly discountRepository: DiscountRepository,

        @InjectRepository(CouponRepository)
        private readonly couponRepository: CouponRepository,

        @InjectRepository(OrderItemRepository)
        private readonly orderItemRepository: OrderItemRepository,
    ) {}

    async completePurchaseForUser( inputData: createNewOrderDto, uId: string ){

        try {
            return this.dataSource.transaction( async (manager) =>  {

                const orderRepository = manager.getRepository(Order);
                const userRepository = manager.getRepository(User);
                const cartItemRepository = manager.getRepository(CartItem);
                const couponRepository = manager.getRepository(Coupon);
                const orderItemRepository = manager.getRepository(OrderItem);

                let user = await this.userRepository.findByUId(uId);
                if(user == null){
                    UserNotFoundException.byUId();
                }
        
                const cart = await this.shoppingCartRepository.findByUser(user.id);
                if(cart == null){
                    ShoppingCartNotFoundException.byId(user.id);
                }
        
                const customerAddress = await this.customerAddressRepository.findActiveByUser(user.id);
                if( customerAddress == null ){
                    CustomerAddressNotFoundException.byUserId();
                }
        
                //Get coupon data - bu kısma bak
                let selectedCoupon: Coupon = null;
                let couponPercentage: number = 1;
        
                if( inputData.couponId != null ){
                    selectedCoupon = await this.couponRepository.findActiveById(inputData.couponId);
                    couponPercentage = (100 - selectedCoupon.discountPercentage) / 100;
        
                    if( selectedCoupon == null ){
                        CouponInvalidDataException.byInvalidCoupon(selectedCoupon.id);
                    }
                } 
        
                let newOrder = new Order();
                newOrder.user = user;
                newOrder.address = customerAddress;
                newOrder.totalPrice = 0;
                newOrder.usedCoupon = selectedCoupon;
                newOrder.orderDate = new Date();
        
                const cartItemList = await this.cartItemRepository.findByCartWithPublisher(cart.id);
                if( cartItemList.length == 0 ){
                    OrderBadRequestException.ByEmptyCart();
                }

                let newOrderItemList: OrderItem[] = [];
        
                for( const item of cartItemList ){
        
                    const discount: Discount = await this.discountRepository.findByBook(item.book.id);
        
                    let discountPercentage: number;
        
                    const newOrderItem = new OrderItem();
                    newOrderItem.book = item.book;
                    newOrderItem.unitPrice = item.book.price;
                    newOrderItem.quantity = item.quantity;
                    if( discount == null ){
                        newOrderItem.discount = null;
                        discountPercentage = 1;
                    }
                    else{
                        newOrderItem.discount = discount;
                        discountPercentage = (100 - discount.discountPercentage) / 100;
                    }
        
                    //Calculate final cost of item
                    let itemCost = ( ( newOrderItem.book.price * discountPercentage ) * newOrderItem.quantity ) * couponPercentage;
                    itemCost = parseFloat(itemCost.toFixed(2));
        
                    //make transaction between users and save
                    if( user.balance < itemCost ){
                        UserBadRequestException.byNotEnoughBalance(user.id);
                    }

                    const updatedUserBalance = user.balance - itemCost;
                    user.balance = parseFloat(updatedUserBalance.toFixed(2));
                    user = await userRepository.save(user);

                    const publisher = await this.userRepository.findById(newOrderItem.book.publisher.id);
                    const updatedPublisherBalance = Number(publisher.balance) + itemCost;
                    publisher.balance = parseFloat( updatedPublisherBalance.toFixed(2) );
                    await userRepository.save(publisher);
        
                    //Update totalPrice in newOrder
                    newOrder.totalPrice += itemCost;
        
                    //delete cartItem
                    await cartItemRepository.delete(item);
        
                    //put orderItem into list
                    newOrderItemList.push(newOrderItem);
                }
        
                //update used coupon
                if( selectedCoupon != null ){
                    selectedCoupon.used = true;
                    await couponRepository.save(selectedCoupon);
                }
        
                //save order
                newOrder.totalPrice = parseFloat(newOrder.totalPrice.toFixed(2));
                newOrder = await orderRepository.save(newOrder);

                //assign order to order items and save them
                for( const item of newOrderItemList ){
                    item.order = newOrder;
                    await orderItemRepository.save(item);
                }

                return newOrder;
            });
        }
        catch(error){
            throw error;
        }
    }

}