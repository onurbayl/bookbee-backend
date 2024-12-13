import { Test, TestingModule } from '@nestjs/testing';
import { Book } from 'src/app/book/book.entity';
import { BookRepository } from 'src/app/book/book.repository';
import { BookNotFoundException } from 'src/app/book/exceptions/book-not-found.exception';
import { CartItem } from 'src/app/cart-item/cart-item.entity';
import { CartItemRepository } from 'src/app/cart-item/cart-item.repository';
import { CartItemService } from 'src/app/cart-item/cart-item.service';
import { CartItemNotFoundException } from 'src/app/cart-item/exceptions/cart-item-not-found.exception';
import { Discount } from 'src/app/discount/discount.entity';
import { DiscountRepository } from 'src/app/discount/discount.repository';
import { ShoppingCartNotFoundException } from 'src/app/shopping-cart/exceptions/shopping-cart-not-found.exception';
import { ShoppingCart } from 'src/app/shopping-cart/shopping-cart.entity';
import { ShoppingCartRepository } from 'src/app/shopping-cart/shopping-cart.repository';
import { UserRepository } from 'src/app/user/user.repository';

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  let cartItemRepository: Partial<CartItemRepository>;
  let bookRepository: Partial<BookRepository>;
  let userRepository: Partial<UserRepository>;
  let shoppingCartRepository: Partial<ShoppingCartRepository>;
  let discountRepository: Partial<DiscountRepository>;

  beforeEach(async () => {
    cartItemRepository = {
      findByBookAndCart: jest.fn(),
      findByCart: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    bookRepository = {
      findById: jest.fn(),
    };

    userRepository = {
      //
    };

    shoppingCartRepository = {
      findByUser: jest.fn(),
    };

    discountRepository = {
      findByBook: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        { provide: CartItemRepository, useValue: cartItemRepository },
        { provide: BookRepository, useValue: bookRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: ShoppingCartRepository, useValue: shoppingCartRepository },
        { provide: DiscountRepository, useValue: discountRepository },
      ],
    }).compile();

    cartItemService = module.get<CartItemService>(CartItemService);
  });

  describe('addItemToCart', () => {
    it('Success_CartItem_Exist', async () => {
        const mockCart = new ShoppingCart();
        mockCart.id = 1;

        const mockBook = new Book();
        mockBook.id = 1;
        mockBook.name = 'Test Book';

        const mockCartItem = new CartItem();
        mockCartItem.id = 1;
        mockCartItem.book = mockBook;
        mockCartItem.cart = mockCart;
        mockCartItem.quantity = 1;

        const mockUpdatedCartItem = new CartItem();
        mockUpdatedCartItem.id = 1;
        mockUpdatedCartItem.book = mockBook;
        mockUpdatedCartItem.cart = mockCart;
        mockUpdatedCartItem.quantity = 2;

        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
        (cartItemRepository.findByBookAndCart as jest.Mock).mockResolvedValue(mockCartItem);
        (cartItemRepository.save as jest.Mock).mockImplementation((cartItem: any) => {
          return Promise.resolve(cartItem);  
        });

        const result = await cartItemService.addItemToCart(1, 1);

        expect(result).toEqual(mockUpdatedCartItem);
        expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
        expect(bookRepository.findById).toHaveBeenCalledWith(1);
        expect(cartItemRepository.findByBookAndCart).toHaveBeenCalledWith(1, 1);
    });

    it('Success_CartItem_NotExist', async () => {
      const mockCart = new ShoppingCart();
      mockCart.id = 1;

      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.name = 'Test Book';

      const mockNewCartItem = new CartItem();
      mockNewCartItem.book = mockBook;
      mockNewCartItem.cart = mockCart;
      mockNewCartItem.quantity = 1;

      const mockInsertedCartItem = new CartItem();
      mockInsertedCartItem.id = 1;
      mockInsertedCartItem.book = mockBook;
      mockInsertedCartItem.cart = mockCart;
      mockInsertedCartItem.quantity = 1;

      (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
      (cartItemRepository.findByBookAndCart as jest.Mock).mockResolvedValue(null);
      (cartItemRepository.save as jest.Mock).mockImplementation((cartItem: CartItem) => {
        if( cartItem.book == mockBook && cartItem.cart == mockCart ){
          cartItem.id = 1;
          return Promise.resolve(cartItem);
        } else {
          throw new Error('Invalid cart item');
        }
      });

      const result = await cartItemService.addItemToCart(1, 1);

      expect(result).toEqual(mockInsertedCartItem);
      expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
      expect(bookRepository.findById).toHaveBeenCalledWith(1);
      expect(cartItemRepository.findByBookAndCart).toHaveBeenCalledWith(1, 1);
  });

  it('Fail_ShoppingCartNotFound', async () => {

    (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(null);

    await expect(cartItemService.addItemToCart(1, 1)).rejects.toThrow(ShoppingCartNotFoundException);
    expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
  });

  it('Fail_BookNotFound', async () => {
    const mockCart = new ShoppingCart();
    mockCart.id = 1;

    (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
    (bookRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(cartItemService.addItemToCart(1, 1)).rejects.toThrow(BookNotFoundException);
    expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
    expect(bookRepository.findById).toHaveBeenCalledWith(1);
  });

  });
  
  describe('removeItemToCart', () => {
      it('Success_CartItem_Deleted', async () => {
          const mockCart = new ShoppingCart();
          mockCart.id = 1;
  
          const mockBook = new Book();
          mockBook.id = 1;
          mockBook.name = 'Test Book';
  
          const mockCartItem = new CartItem();
          mockCartItem.id = 1;
          mockCartItem.book = mockBook;
          mockCartItem.cart = mockCart;
          mockCartItem.quantity = 1;

          const expectedResult = {message: 'This item with ID 1 removed from shopping cart.'};
  
          (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
          (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
          (cartItemRepository.findByBookAndCart as jest.Mock).mockResolvedValue(mockCartItem);
          (cartItemRepository.delete as jest.Mock).mockResolvedValue(null);
  
          const result = await cartItemService.removeItemToCart(1, 1);
  
          expect(result).toEqual(expectedResult);
          expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
          expect(bookRepository.findById).toHaveBeenCalledWith(1);
          expect(cartItemRepository.findByBookAndCart).toHaveBeenCalledWith(1, 1);
      });
  
      it('Success_CartItem_Updated', async () => {
        const mockCart = new ShoppingCart();
        mockCart.id = 1;
  
        const mockBook = new Book();
        mockBook.id = 1;
        mockBook.name = 'Test Book';
  
        const mockCartItem = new CartItem();
        mockCartItem.id = 1;
        mockCartItem.book = mockBook;
        mockCartItem.cart = mockCart;
        mockCartItem.quantity = 2;

        const expectedResultCartItem = new CartItem();
        expectedResultCartItem.id = 1;
        expectedResultCartItem.book = mockBook;
        expectedResultCartItem.cart = mockCart;
        expectedResultCartItem.quantity = 1;
  
        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
        (cartItemRepository.findByBookAndCart as jest.Mock).mockResolvedValue(mockCartItem);
        (cartItemRepository.save as jest.Mock).mockImplementation((cartItem: CartItem) => {
          if( cartItem.book == mockBook && cartItem.cart == mockCart ){
            return Promise.resolve(cartItem);
          } else {
            throw new Error('Invalid cart item');
          }
        });
  
        const result = await cartItemService.removeItemToCart(1, 1);
  
        expect(result).toEqual(expectedResultCartItem);
        expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
        expect(bookRepository.findById).toHaveBeenCalledWith(1);
        expect(cartItemRepository.findByBookAndCart).toHaveBeenCalledWith(1, 1);
    });
  
    it('Fail_ShoppingCartNotFound', async () => {
  
      (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(null);
  
      await expect(cartItemService.removeItemToCart(1, 1)).rejects.toThrow(ShoppingCartNotFoundException);
      expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
    });
  
    it('Fail_BookNotFound', async () => {
      const mockCart = new ShoppingCart();
      mockCart.id = 1;
  
      (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
      (bookRepository.findById as jest.Mock).mockResolvedValue(null);
  
      await expect(cartItemService.removeItemToCart(1, 1)).rejects.toThrow(BookNotFoundException);
      expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
      expect(bookRepository.findById).toHaveBeenCalledWith(1);
    });

    it('Fail_CartItemNotFound', async () => {
      const mockCart = new ShoppingCart();
      mockCart.id = 1;

      const mockBook = new Book();
      mockBook.id = 1;
      mockBook.name = 'Test Book';
  
      (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
      (bookRepository.findById as jest.Mock).mockResolvedValue(mockBook);
      (cartItemRepository.findByBookAndCart as jest.Mock).mockResolvedValue(null);
  
      await expect(cartItemService.removeItemToCart(1, 1)).rejects.toThrow(CartItemNotFoundException);
      expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
      expect(bookRepository.findById).toHaveBeenCalledWith(1);
      expect(cartItemRepository.findByBookAndCart).toHaveBeenCalledWith(1, 1);
    });
  
  });

  describe('getItemsFromCart', () => {
    it('Success', async () => {
        const mockCart = new ShoppingCart();
        mockCart.id = 1;

        const mockBook1 = new Book();
        mockBook1.id = 1;
        mockBook1.name = 'Test Book 1';
        mockBook1.price = 8.00;

        const mockBook2 = new Book();
        mockBook2.id = 2;
        mockBook2.name = 'Test Book 2';
        mockBook2.price = 20.00;

        const mockCartItem1 = new CartItem();
        mockCartItem1.id = 1;
        mockCartItem1.book = mockBook1;
        mockCartItem1.cart = mockCart;
        mockCartItem1.quantity = 2;

        const mockCartItem2 = new CartItem();
        mockCartItem2.id = 2;
        mockCartItem2.book = mockBook2;
        mockCartItem2.cart = mockCart;
        mockCartItem2.quantity = 2;

        const mockCartItemList: CartItem[] = [];
        mockCartItemList.push(mockCartItem1);
        mockCartItemList.push(mockCartItem2);

        const mockDiscount = new Discount();
        mockDiscount.id = 1;
        mockDiscount.book = mockBook2;
        mockDiscount.discountPercentage = 10;

        const expectedResult = {message: 'This item with ID 1 removed from shopping cart.'};

        (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(mockCart);
        (cartItemRepository.findByCart as jest.Mock).mockResolvedValue(mockCartItemList);
        (discountRepository.findByBook as jest.Mock).mockImplementation( (bookId: number) => {
          if( bookId == 1 ){
            return null;
          }
          else if( bookId == 2 ){
            return mockDiscount;
          }
        } )

        const result = await cartItemService.getItemsFromCart(1);

        expect(result.length).toBe(2);
        const normalSum = result.reduce((acc, item) => acc + item.normalPrice, 0);
        const finalSum = result.reduce((acc, item) => acc + item.finalPrice, 0);
        expect(normalSum).toBe(56);
        expect(finalSum).toBe(52);
        expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
        expect(cartItemRepository.findByCart).toHaveBeenCalledWith(1);
        expect(discountRepository.findByBook).toHaveBeenCalledWith(1);
        expect(discountRepository.findByBook).toHaveBeenCalledWith(2);
    });

    it('Fail_ShoppingCartNotFound', async () => {
  
      (shoppingCartRepository.findByUser as jest.Mock).mockResolvedValue(null);
  
      await expect(cartItemService.getItemsFromCart(1)).rejects.toThrow(ShoppingCartNotFoundException);
      expect(shoppingCartRepository.findByUser).toHaveBeenCalledWith(1);
    });

});

});
