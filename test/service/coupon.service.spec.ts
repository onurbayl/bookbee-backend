import { Test, TestingModule } from '@nestjs/testing';
import { Coupon } from 'src/app/coupon/coupon.entity';
import { CouponRepository } from 'src/app/coupon/coupon.repository';
import { CouponService } from 'src/app/coupon/coupon.service';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { User } from 'src/app/user/user.entity';
import { UserRepository } from 'src/app/user/user.repository';

describe('CartItemService', () => {
  let couponService: CouponService;
  let couponRepository: Partial<CouponRepository>;
  let userRepository: Partial<UserRepository>;

  beforeEach(async () => {
    couponRepository = {
        findActiveByUser: jest.fn(),
    };

    userRepository = {
        findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponService,
        { provide: CouponRepository, useValue: couponRepository },
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    couponService = module.get<CouponService>(CouponService);
  });

  describe('getCouponsForUser', () => {
    it('Success', async () => {
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.name = 'Mock User';

        const mockCoupon1 = new Coupon();
        mockCoupon1.id = 1;
        mockCoupon1.discountPercentage = 10;

        const mockCoupon2 = new Coupon();
        mockCoupon2.id = 2;
        mockCoupon2.discountPercentage = 20;

        const mockCouponList: Coupon[] = [mockCoupon1, mockCoupon2];

        (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
        (couponRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockCouponList);

        const result = await couponService.getCouponsForUser(1);

        expect(result).toEqual([mockCoupon1, mockCoupon2]);
        expect(userRepository.findById).toHaveBeenCalledWith(1);
        expect(couponRepository.findActiveByUser).toHaveBeenCalledWith(1);
    });

  it('Fail_UserNotFound', async () => {

    (userRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(couponService.getCouponsForUser(1)).rejects.toThrow(UserNotFoundException);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });

  });

});
