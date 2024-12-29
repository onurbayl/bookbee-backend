import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/app/user/user.repository';
import { OrderService } from 'src/app/order/order.service';
import { OrderRepository } from 'src/app/order/order.repository';
import { DataSource } from 'typeorm';
import { ShoppingCartRepository } from 'src/app/shopping-cart/shopping-cart.repository';
import { CustomerAddressRepository } from 'src/app/customer-address/customer-address.repository';
import { CartItemRepository } from 'src/app/cart-item/cart-item.repository';
import { DiscountRepository } from 'src/app/discount/discount.repository';
import { CouponRepository } from 'src/app/coupon/coupon.repository';
import { OrderItemRepository } from 'src/app/order-item/order-item.repository';
import { User } from 'src/app/user/user.entity';
import { ShoppingCart } from 'src/app/shopping-cart/shopping-cart.entity';
import { CustomerAddress } from 'src/app/customer-address/customer-address.entity';
import { createNewOrderDto } from 'src/app/order/dtos/create-new-order-dto';
import { Coupon } from 'src/app/coupon/coupon.entity';
import { CartItem } from 'src/app/cart-item/cart-item.entity';
import { Book } from 'src/app/book/book.entity';
import { Discount } from 'src/app/discount/discount.entity';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { ShoppingCartNotFoundException } from 'src/app/shopping-cart/exceptions/shopping-cart-not-found.exception';
import { CustomerAddressNotFoundException } from 'src/app/customer-address/exceptions/customer-address-not-found.exception';
import { CouponInvalidDataException } from 'src/app/coupon/exceptions/coupon-invalid-data.exception';
import { OrderBadRequestException } from 'src/app/order/exceptions/order-bad-request.exception';
import { UserBadRequestException } from 'src/app/user/exceptions/user-bad-request.exception';
import { Order } from 'src/app/order/order.entity';
import { OrderItem } from 'src/app/order-item/order-item.entity';
import { OrderNotFoundException } from 'src/app/order/exceptions/order-not-found.exception';


describe('OrderService', () => {
  let orderService: OrderService;
  let dataSource: DataSource;
  let orderRepository: Partial<OrderRepository>;
  let userRepository: Partial<UserRepository>;
  let shoppingCartRepository: Partial<ShoppingCartRepository>;
  let customerAddressRepository: Partial<CustomerAddressRepository>;
  let cartItemRepository: Partial<CartItemRepository>;
  let discountRepository: Partial<DiscountRepository>;
  let couponRepository: Partial<CouponRepository>;
  let orderItemRepository: Partial<OrderItemRepository>;

  let mockId = 1;

  beforeEach(async () => {

    orderRepository = {
        findByUser: jest.fn(),
        findById: jest.fn(),
    };

    userRepository = {
        findByUId: jest.fn(),
        findById: jest.fn(), 
    };

    shoppingCartRepository = {
        findByUser: jest.fn(),
    };

    customerAddressRepository = {
        findActiveByUser: jest.fn(),
    };

    cartItemRepository = {
        findByCartWithPublisher: jest.fn(),
    };

    discountRepository = {
        findByBook: jest.fn(),
    };

    couponRepository = {
        findActiveById: jest.fn(),
    };

    orderItemRepository = {
        findByOrder: jest.fn(),
    };

    mockId = 1;

    const mockDataSource = {
        transaction: jest.fn().mockImplementation(async (transactionCallback) => {
            const mockManager = {
                remove: jest.fn().mockResolvedValue(undefined), // Simulate void return for `remove`
                save: jest.fn().mockImplementation((entityClass, entityInstance) => {
                    if( entityInstance.id == null ){
                        entityInstance.id = mockId;
                        mockId++;
                    }
                    return Promise.resolve(entityInstance);
                }),
            };
        
            return transactionCallback(mockManager);
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: DataSource, useValue: mockDataSource },
        { provide: OrderRepository, useValue: orderRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: ShoppingCartRepository, useValue: shoppingCartRepository },
        { provide: CustomerAddressRepository, useValue: customerAddressRepository },
        { provide: CartItemRepository, useValue: cartItemRepository },
        { provide: DiscountRepository, useValue: discountRepository },
        { provide: CouponRepository, useValue: couponRepository },
        { provide: OrderItemRepository, useValue: orderItemRepository },
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);

    orderService = module.get<OrderService>(OrderService);
  });

  describe('completePurchaseForUser', () => {
    it('Success_WithCoupon', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = 1;

        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';
        mockUser.balance = 300;

        const mockCart = new ShoppingCart();

        const mockAddress = new CustomerAddress();

        const mockCoupon = new Coupon();
        mockCoupon.id = 1;
        mockCoupon.discountPercentage = 50;
        mockCoupon.user = mockUser;

        const mockPublisher = new User();
        mockPublisher.id = 2;
        mockPublisher.name = 'Mock Publisher';
        mockPublisher.balance = 300;

        const mockBook_1 = new Book();
        mockBook_1.id = 1;
        mockBook_1.price = 100;
        mockBook_1.publisher = mockPublisher;

        const mockBook_2 = new Book();
        mockBook_1.id = 2;
        mockBook_2.price = 100;
        mockBook_2.publisher = mockPublisher;

        const mockCartItem_1 = new CartItem();
        mockCartItem_1.id = 1;
        mockCartItem_1.book = mockBook_1;
        mockCartItem_1.quantity = 1;

        const mockCartItem_2 = new CartItem();
        mockCartItem_2.id = 2;
        mockCartItem_2.book = mockBook_2;
        mockCartItem_2.quantity = 1;

        const mockCartItemList = [mockCartItem_1, mockCartItem_2];

        const mockDiscount = new Discount();
        mockDiscount.id = 1;
        mockDiscount.book = mockBook_2;
        mockDiscount.discountPercentage = 50;

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockAddress);
        (couponRepository.findActiveById as jest.Mock).mockResolvedValue(mockCoupon);
        (cartItemRepository.findByCartWithPublisher as jest.Mock).mockResolvedValue(mockCartItemList);
        (discountRepository.findByBook as jest.Mock).mockImplementation( (bookId: number) => {
            if( bookId == 1 ){
              return null;
            }
            else if( bookId == 2 ){
              return mockDiscount;
            }
        } );
        (userRepository.findById as jest.Mock).mockResolvedValue(mockPublisher);

        const result = await orderService.completePurchaseForUser(mockInput, "1");

        expect(result.address).toEqual(mockAddress);
        expect(result.totalPrice).toEqual(75);
        expect(result.usedCoupon).toEqual(mockCoupon);
        expect(result.usedCoupon.used).toEqual(true);
        expect(result.user).toEqual(mockUser);
    });

    it('Success_WithoutCoupon', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = null;

        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';
        mockUser.balance = 300;

        const mockCart = new ShoppingCart();

        const mockAddress = new CustomerAddress();

        const mockPublisher = new User();
        mockPublisher.id = 2;
        mockPublisher.name = 'Mock Publisher';
        mockPublisher.balance = 300;

        const mockBook_1 = new Book();
        mockBook_1.id = 1;
        mockBook_1.price = 100;
        mockBook_1.publisher = mockPublisher;

        const mockBook_2 = new Book();
        mockBook_1.id = 2;
        mockBook_2.price = 100;
        mockBook_2.publisher = mockPublisher;

        const mockCartItem_1 = new CartItem();
        mockCartItem_1.id = 1;
        mockCartItem_1.book = mockBook_1;
        mockCartItem_1.quantity = 1;

        const mockCartItem_2 = new CartItem();
        mockCartItem_2.id = 2;
        mockCartItem_2.book = mockBook_2;
        mockCartItem_2.quantity = 1;

        const mockCartItemList = [mockCartItem_1, mockCartItem_2];

        const mockDiscount = new Discount();
        mockDiscount.id = 1;
        mockDiscount.book = mockBook_2;
        mockDiscount.discountPercentage = 50;

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockAddress);
        (couponRepository.findActiveById as jest.Mock).mockResolvedValue(null);
        (cartItemRepository.findByCartWithPublisher as jest.Mock).mockResolvedValue(mockCartItemList);
        (discountRepository.findByBook as jest.Mock).mockImplementation( (bookId: number) => {
            if( bookId == 1 ){
              return null;
            }
            else if( bookId == 2 ){
              return mockDiscount;
            }
        } );
        (userRepository.findById as jest.Mock).mockResolvedValue(mockPublisher);

        const result = await orderService.completePurchaseForUser(mockInput, "1");

        expect(result.address).toEqual(mockAddress);
        expect(result.totalPrice).toEqual(150);
        expect(result.usedCoupon).toEqual(null);
        expect(result.user).toEqual(mockUser);
    });

    it('Fail_UserNotFoundException_byUId', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = null;

        (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

        const err = await orderService.completePurchaseForUser(mockInput, "1").catch(e => e);
        expect(err).toBeInstanceOf(UserNotFoundException);
        expect(err.message).toContain('User with given UID not found');
    });

    it('Fail_ShoppingCartNotFoundException_byId', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = null;

        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';
        mockUser.balance = 300;

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(null);

        const err = await orderService.completePurchaseForUser(mockInput, "1").catch(e => e);
        expect(err).toBeInstanceOf(ShoppingCartNotFoundException);
        expect(err.message).toContain('Shopping Cart with user ID 1 not found');
    });

    it('Fail_CustomerAddressNotFoundException_byUserId', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = null;

        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';
        mockUser.balance = 300;

        const mockCart = new ShoppingCart();

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(null);

        const err = await orderService.completePurchaseForUser(mockInput, "1").catch(e => e);
        expect(err).toBeInstanceOf(CustomerAddressNotFoundException);
        expect(err.message).toContain('The customer address for given user is not found');
    });

    it('Fail_CouponInvalidDataException_byInvalidCoupon', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = 1;

        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';
        mockUser.balance = 300;

        const mockCart = new ShoppingCart();

        const mockAddress = new CustomerAddress();

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockAddress);
        (couponRepository.findActiveById as jest.Mock).mockResolvedValue(null);

        const err = await orderService.completePurchaseForUser(mockInput, "1").catch(e => e);
        expect(err).toBeInstanceOf(CouponInvalidDataException);
        expect(err.message).toContain('is already used or expired.');
    });

    it('Fail_CouponInvalidDataException_byWrongUser', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = 1;

        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';
        mockUser.balance = 300;

        const mockUser2 = new User();
        mockUser2.id = 3;
        mockUser2.name = 'Mock User 2';
        mockUser2.balance = 300;

        const mockCart = new ShoppingCart();

        const mockAddress = new CustomerAddress();

        const mockCoupon = new Coupon();
        mockCoupon.id = 1;
        mockCoupon.discountPercentage = 50;
        mockCoupon.user = mockUser2;

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockAddress);
        (couponRepository.findActiveById as jest.Mock).mockResolvedValue(mockCoupon);

        const err = await orderService.completePurchaseForUser(mockInput, "1").catch(e => e);
        expect(err).toBeInstanceOf(CouponInvalidDataException);
        expect(err.message).toContain('This user does not own this coupon');
    });

    it('Fail_OrderBadRequestException_ByEmptyCart', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = 1;

        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';
        mockUser.balance = 300;

        const mockCart = new ShoppingCart();

        const mockAddress = new CustomerAddress();

        const mockCoupon = new Coupon();
        mockCoupon.id = 1;
        mockCoupon.discountPercentage = 50;
        mockCoupon.user = mockUser;

        const mockCartItemList = [];

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockAddress);
        (couponRepository.findActiveById as jest.Mock).mockResolvedValue(mockCoupon);
        (cartItemRepository.findByCartWithPublisher as jest.Mock).mockResolvedValue(mockCartItemList);

        const err = await orderService.completePurchaseForUser(mockInput, "1").catch(e => e);
        expect(err).toBeInstanceOf(OrderBadRequestException);
        expect(err.message).toContain('To request a purchase, the user cart should contain at least 1 item');
    });

    it('Fail_UserBadRequestException_byNotEnoughBalance', async () => {

        const mockInput = new createNewOrderDto();
        mockInput.couponId = 1;

        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';
        mockUser.balance = 55;

        const mockCart = new ShoppingCart();

        const mockAddress = new CustomerAddress();

        const mockCoupon = new Coupon();
        mockCoupon.id = 1;
        mockCoupon.discountPercentage = 50;
        mockCoupon.user = mockUser;

        const mockPublisher = new User();
        mockPublisher.id = 2;
        mockPublisher.name = 'Mock Publisher';
        mockPublisher.balance = 300;

        const mockBook_1 = new Book();
        mockBook_1.id = 1;
        mockBook_1.price = 100;
        mockBook_1.publisher = mockPublisher;

        const mockBook_2 = new Book();
        mockBook_1.id = 2;
        mockBook_2.price = 100;
        mockBook_2.publisher = mockPublisher;

        const mockCartItem_1 = new CartItem();
        mockCartItem_1.id = 1;
        mockCartItem_1.book = mockBook_1;
        mockCartItem_1.quantity = 1;

        const mockCartItem_2 = new CartItem();
        mockCartItem_2.id = 2;
        mockCartItem_2.book = mockBook_2;
        mockCartItem_2.quantity = 1;

        const mockCartItemList = [mockCartItem_1, mockCartItem_2];

        const mockDiscount = new Discount();
        mockDiscount.id = 1;
        mockDiscount.book = mockBook_2;
        mockDiscount.discountPercentage = 50;

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockAddress);
        (couponRepository.findActiveById as jest.Mock).mockResolvedValue(mockCoupon);
        (cartItemRepository.findByCartWithPublisher as jest.Mock).mockResolvedValue(mockCartItemList);
        (discountRepository.findByBook as jest.Mock).mockImplementation( (bookId: number) => {
            if( bookId == 1 ){
              return null;
            }
            else if( bookId == 2 ){
              return mockDiscount;
            }
        } );
        (userRepository.findById as jest.Mock).mockResolvedValue(mockPublisher);

        const err = await orderService.completePurchaseForUser(mockInput, "1").catch(e => e);
        expect(err).toBeInstanceOf(UserBadRequestException);
        expect(err.message).toContain('The user with Id 1 does not have enough balance to complete this transaction');
    });

  });
  
  describe('completePurchaseForUser', () => {
    it('Success', async () => {
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';

        const mockOrder1 = new Order();
        mockOrder1.id = 1;

        const mockOrder2 = new Order();
        mockOrder2.id = 2;

        const orderList = [mockOrder1, mockOrder2];

        (userRepository.findByUId as jest.Mock).mockReturnValue(mockUser);
        (orderRepository.findByUser as jest.Mock).mockReturnValue(orderList);

        const result = await orderService.getOrderHistory('1');

        expect(result).toEqual(orderList);
        expect(userRepository.findByUId).toHaveBeenCalledWith('1');
        expect(orderRepository.findByUser).toHaveBeenCalledWith(1);
    });

    it('Fail_UserNotFoundException_byUId', async () => {

        (userRepository.findByUId as jest.Mock).mockReturnValue(null);

        const err = await orderService.getOrderHistory('1').catch(e => e);
        expect(err).toBeInstanceOf(UserNotFoundException);
        expect(err.message).toContain('User with given UID not found');
    });

  });

  describe('completePurchaseForUser', () => {
    it('Success', async () => {
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';

        const mockAddress = new CustomerAddress();
        mockAddress.addressInfo = 'Potato';

        const mockBook = new Book();
        mockBook.id = 1;
        mockBook.price = 100;

        const mockDiscount = new Discount();
        mockDiscount.discountPercentage = 50;

        const mockCoupon = new Coupon();
        mockCoupon.discountPercentage = 50;

        const mockOrder = new Order();
        mockOrder.id = 1;
        mockOrder.user = mockUser;
        mockOrder.usedCoupon = mockCoupon;
        mockOrder.totalPrice = 25;
        mockOrder.orderDate = new Date();
        mockOrder.address = mockAddress;

        const mockOrderItem = new OrderItem();
        mockOrderItem.book = mockBook;
        mockOrderItem.discount = mockDiscount;
        mockOrderItem.quantity = 1;
        mockOrderItem.unitPrice = 100;
        mockOrderItem.order = mockOrder;
        mockOrderItem.id = 1;

        const mockOrderItemList = [mockOrderItem];

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);
        (orderItemRepository.findByOrder as jest.Mock).mockResolvedValue(mockOrderItemList);

        const result = await orderService.getOrderHistoryDetails(1, '1');

        expect(result.id).toEqual(1);
        expect(result.addressInfo).toEqual('Potato');
        expect(result.user).toEqual(mockUser);
        expect(result.subtotal).toEqual(50);
        expect(result.totalPrice).toEqual(25);
        expect(result.couponDiscountPercentage).toEqual(50);
        expect(result.orderItems.length).toEqual(1);
        expect(result.orderItems[0].book).toEqual(mockBook);
        expect(result.orderItems[0].discountPercentage).toEqual(50);
        expect(result.orderItems[0].discountedPrice).toEqual(50);
        expect(result.orderItems[0].unitPrice).toEqual(100);
        expect(result.orderItems[0].totalPrice).toEqual(50);
    });

    it('Fail_UserNotFoundException_byUId', async () => {

        (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
        
        const err = await orderService.getOrderHistoryDetails(1, '1').catch(e => e);
        expect(err).toBeInstanceOf(UserNotFoundException);
        expect(err.message).toContain('User with given UID not found');
    });

    it('Fail_OrderNotFoundException_byId', async () => {
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';

        const mockAddress = new CustomerAddress();
        mockAddress.addressInfo = 'Potato';

        const mockBook = new Book();
        mockBook.id = 1;
        mockBook.price = 100;

        const mockDiscount = new Discount();
        mockDiscount.discountPercentage = 50;

        const mockCoupon = new Coupon();
        mockCoupon.discountPercentage = 50;

        const mockOrder = new Order();
        mockOrder.id = 1;
        mockOrder.user = mockUser;
        mockOrder.usedCoupon = mockCoupon;
        mockOrder.totalPrice = 25;
        mockOrder.orderDate = new Date();
        mockOrder.address = mockAddress;

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (orderRepository.findById as jest.Mock).mockResolvedValue(null);

        const err = await orderService.getOrderHistoryDetails(1, '1').catch(e => e);
        expect(err).toBeInstanceOf(OrderNotFoundException);
        expect(err.message).toContain('The order with ID 1 not found');
    });

    it('Fail_OrderBadRequestException_ByWrongUser', async () => {
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';

        const mockUser2 = new User();
        mockUser2.id = 2;
        mockUser2.name = 'Mock User 2';

        const mockAddress = new CustomerAddress();
        mockAddress.addressInfo = 'Potato';

        const mockBook = new Book();
        mockBook.id = 1;
        mockBook.price = 100;

        const mockDiscount = new Discount();
        mockDiscount.discountPercentage = 50;

        const mockCoupon = new Coupon();
        mockCoupon.discountPercentage = 50;

        const mockOrder = new Order();
        mockOrder.id = 1;
        mockOrder.user = mockUser2;
        mockOrder.usedCoupon = mockCoupon;
        mockOrder.totalPrice = 25;
        mockOrder.orderDate = new Date();
        mockOrder.address = mockAddress;

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

        const err = await orderService.getOrderHistoryDetails(1, '1').catch(e => e);
        expect(err).toBeInstanceOf(OrderBadRequestException);
        expect(err.message).toContain('The user does not own this order');
    });

  });

});
