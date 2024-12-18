import { Test, TestingModule } from '@nestjs/testing';
import { Coupon } from 'src/app/coupon/coupon.entity';
import { CouponRepository } from 'src/app/coupon/coupon.repository';
import { CouponService } from 'src/app/coupon/coupon.service';
import { createNewCouponDto } from 'src/app/coupon/dtos/create-new-coupon-dto';
import { CouponInvalidDataException } from 'src/app/coupon/exceptions/coupon-invalid-data.exception';
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
      save: jest.fn(),
    };

    userRepository = {
      findByUId: jest.fn(),
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

        (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
        (couponRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockCouponList);

        const result = await couponService.getCouponsForUser("1");

        expect(result).toEqual([mockCoupon1, mockCoupon2]);
        expect(userRepository.findByUId).toHaveBeenCalledWith("1");
        expect(couponRepository.findActiveByUser).toHaveBeenCalledWith(1);
    });

  it('Fail_UserNotFound', async () => {

    (userRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(couponService.getCouponsForUser("1")).rejects.toThrow(UserNotFoundException);
    expect(userRepository.findByUId).toHaveBeenCalledWith("1");
  });

  });

  describe('addCouponToDatabase', () => {
    it('Success', async () => {

      const mockInputData = new createNewCouponDto();
      mockInputData.discountPercentage = 20;
      mockInputData.endDate = new Date('2028-12-12');
      mockInputData.userId = 1;
    
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockCurrentDate = new Date('2024-12-12');

      const expectedResult = new Coupon();
      expectedResult.id = 1;
      expectedResult.user = mockUser;
      expectedResult.discountPercentage = 20;
      expectedResult.startDate = mockCurrentDate;
      expectedResult.endDate = mockInputData.endDate;
      expectedResult.used = false;

      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (couponRepository.save as jest.Mock).mockImplementation((coupon: Coupon) => {
        coupon.id = 1;
        return Promise.resolve(coupon);
      });

      const result = await couponService.addCouponToDatabase(mockInputData);

      expect(result.id).toEqual(expectedResult.id);
      expect(result.discountPercentage).toEqual(expectedResult.discountPercentage);
      expect(result.endDate).toEqual(expectedResult.endDate);
      expect(result.used).toEqual(expectedResult.used);
      expect(result.user).toEqual(expectedResult.user);
      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(couponRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Fail_CouponInvalidData_MissingData', async () => {

      const mockInputData = new createNewCouponDto();
      mockInputData.discountPercentage = 20;
      mockInputData.endDate = null;
      mockInputData.userId = null;
  
      const err = await couponService.addCouponToDatabase(mockInputData).catch(e => e);
      expect(err).toBeInstanceOf(CouponInvalidDataException);
      expect(err.message).toContain('end date, user ID,');
    });
  
    it('Fail_UserNotFound', async () => {
  
      const mockInputData = new createNewCouponDto();
      mockInputData.discountPercentage = 20;
      mockInputData.endDate = new Date('2028-12-12');
      mockInputData.userId = 1;
  
      (userRepository.findById as jest.Mock).mockResolvedValue(null);
  
      const err = await couponService.addCouponToDatabase(mockInputData).catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
    });
  
    it('Fail_CouponInvalidData_ByEndDate', async () => {
  
      const mockInputData = new createNewCouponDto();
      mockInputData.discountPercentage = 20;
      mockInputData.endDate = new Date('2020-12-12');
      mockInputData.userId = 1;
    
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';
  
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (couponRepository.save as jest.Mock).mockImplementation((coupon: Coupon) => {
        coupon.id = 1;
        return Promise.resolve(coupon);
      });
  
      const err = await couponService.addCouponToDatabase(mockInputData).catch(e => e);
      expect(err).toBeInstanceOf(CouponInvalidDataException);
      expect(err.message).toContain('In coupon, the end date should not be in the past');
    });
  
    it('Fail_CouponInvalidData_ByDiscountPercentage', async () => {
  
      const mockInputData = new createNewCouponDto();
      mockInputData.discountPercentage = 200;
      mockInputData.endDate = new Date('2028-12-12');
      mockInputData.userId = 1;
    
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';
  
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (couponRepository.save as jest.Mock).mockImplementation((coupon: Coupon) => {
        coupon.id = 1;
        return Promise.resolve(coupon);
      });
  
      const err = await couponService.addCouponToDatabase(mockInputData).catch(e => e);
      expect(err).toBeInstanceOf(CouponInvalidDataException);
      expect(err.message).toContain('In coupon, the discount percentage should be between 5 to 100, given value: 200');
    });

  });

});
