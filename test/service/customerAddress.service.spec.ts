import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddress } from 'src/app/customer-address/customer-address.entity';
import { CustomerAddressRepository } from 'src/app/customer-address/customer-address.repository';
import { CustomerAddressService } from 'src/app/customer-address/customer-address.service';
import { UserNotFoundException } from 'src/app/user/exceptions/user-not-found.exception';
import { User } from 'src/app/user/user.entity';
import { UserRepository } from 'src/app/user/user.repository';

describe('CustomerAddressService', () => {
  let customerAddressService: CustomerAddressService;
  let customerAddressRepository: Partial<CustomerAddressRepository>;
  let userRepository: Partial<UserRepository>;

  beforeEach(async () => {
    customerAddressRepository = {
        findActiveByUser: jest.fn(),
    };

    userRepository = {
      findByUId: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerAddressService,
        { provide: CustomerAddressRepository, useValue: customerAddressRepository },
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    customerAddressService = module.get<CustomerAddressService>(CustomerAddressService);
  });

    describe('getActiveAddressForUser', () => {
        it('Success', async () => {
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.name = 'Mock User';

            const mockAddress = new CustomerAddress();
            mockAddress.id = 1;

            (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
            (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockAddress);

            const result = await customerAddressService.getActiveAddressForUser("1");

            expect(result).toEqual(mockAddress);
            expect(userRepository.findByUId).toHaveBeenCalledWith("1");
            expect(customerAddressRepository.findActiveByUser).toHaveBeenCalledWith(1);
        });

        it('Fail_UserNotFound', async () => {
            (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

            const err = await customerAddressService.getActiveAddressForUser("1").catch(e => e);
            expect(err).toBeInstanceOf(UserNotFoundException);
            expect(err.message).toContain('User with given UID not found');
        });
    });
});