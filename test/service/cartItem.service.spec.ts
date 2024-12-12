import { Test, TestingModule } from '@nestjs/testing';
import { Book } from 'src/app/book/book.entity';
import { BookRepository } from 'src/app/book/book.repository';
import { BookNotFoundException } from 'src/app/book/exceptions/book-not-found.exception';
import { CartItem } from 'src/app/cart-item/cart-item.entity';
import { CartItemRepository } from 'src/app/cart-item/cart-item.repository';
import { CartItemService } from 'src/app/cart-item/cart-item.service';
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

  beforeEach(async () => {
    cartItemRepository = {
      findByBookAndCart: jest.fn(),
      save: jest.fn(),
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        { provide: CartItemRepository, useValue: cartItemRepository },
        { provide: BookRepository, useValue: bookRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: ShoppingCartRepository, useValue: shoppingCartRepository },
      ],
    }).compile();

    cartItemService = module.get<CartItemService>(CartItemService);
  });

  describe('findBookByName', () => {
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
          return Promise.resolve(mockInsertedCartItem);
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

  //s

});
