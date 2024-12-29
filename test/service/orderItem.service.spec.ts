import { Test, TestingModule } from "@nestjs/testing";
import { OrderItemBadRequestException } from "src/app/order-item/exceptions/order-item-bad-request.exception";
import { OrderItemRepository } from "src/app/order-item/order-item.repository";
import { OrderItemService } from "src/app/order-item/order-item.service";
import { UserNotFoundException } from "src/app/user/exceptions/user-not-found.exception";
import { User } from "src/app/user/user.entity";
import { UserRepository } from "src/app/user/user.repository";

describe('OrderListService', () => {
  let orderItemService: OrderItemService;
  let orderItemRepository: Partial<OrderItemRepository>;
  let userRepository: Partial<UserRepository>;

  beforeEach(async () => {
    orderItemRepository = {
      findSalesGroup: jest.fn()
    };

    userRepository = {
      findByUId: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        { provide: OrderItemRepository, useValue: orderItemRepository },
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    orderItemService = module.get<OrderItemService>(OrderItemService);
  });

  describe('findLastNSales', () => {
    it('Success', async () => {
      const mockPublisher = new User();
      mockPublisher.id = 1;
      mockPublisher.name = 'Mock Publisher';

      const mockRepoReturn = [
        {
          'date': new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          'quantity': '10',
          'revenue': '60'
        }
      ];

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockPublisher);
      (orderItemRepository.findSalesGroup as jest.Mock).mockResolvedValue(mockRepoReturn);

      const result = await orderItemService.findLastNSales("1", 3);
      const expectedResult = [
        {'date': new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0], 'quantity': 0, 'revenue': 0 },
        {'date': new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], 'quantity': 10, 'revenue': 60 },
        {'date': new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], 'quantity': 0, 'revenue': 0 }
      ];

      expect(result).toEqual(expectedResult);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(orderItemRepository.findSalesGroup).toHaveBeenCalledWith(1);
    });

    it('Fail_NonPositiveDays', async () => {
      const err = await orderItemService.findLastNSales("1", 0).catch(e => e);
      expect(err).toBeInstanceOf(OrderItemBadRequestException);
      expect(err.message).toContain('To get order item data, specify a positive day number. You gave 0');
    });

    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);
      const err = await orderItemService.findLastNSales("1", 1).catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
    });
  });
});