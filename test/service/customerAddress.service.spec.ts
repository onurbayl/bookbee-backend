import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddress } from 'src/app/customer-address/customer-address.entity';
import { CustomerAddressRepository } from 'src/app/customer-address/customer-address.repository';
import { CustomerAddressService } from 'src/app/customer-address/customer-address.service';
import { createNewAddressDto } from 'src/app/customer-address/dtos/create-new-address-dto';
import { CustomerAddressInvalidDataException } from 'src/app/customer-address/exceptions/customer-address-invalid-data.exception';
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
        save: jest.fn(),
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

  describe('addAddressToUser', () => {
    it('Success_NoActiveAddress', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockInput = new createNewAddressDto();
      mockInput.addressInfo = 'Banana';

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(null);
      (customerAddressRepository.save as jest.Mock).mockImplementation((address: CustomerAddress) => {
        address.id = 1;
        return Promise.resolve(address);
      });

      const result = await customerAddressService.addAddressToUser(mockInput, "1");

      expect(result.id).toEqual(1);
      expect(result.current).toEqual(true);
      expect(result.addressInfo).toEqual('Banana');
      expect(result.endDate).toEqual(null);
      expect(result.user).toEqual(mockUser);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(customerAddressRepository.findActiveByUser).toHaveBeenCalledWith(1);
      expect(customerAddressRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Success_ActiveAddress', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockInput = new createNewAddressDto();
      mockInput.addressInfo = 'Banana';

      const mockOldAddress = new CustomerAddress();
      mockOldAddress.current = true;
      mockOldAddress.endDate = null;

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);
      (customerAddressRepository.findActiveByUser as jest.Mock).mockResolvedValue(mockOldAddress);
      (customerAddressRepository.save as jest.Mock).mockImplementation((address: CustomerAddress) => {
        if( address.addressInfo == 'old address' ){
          address.current = false;
          return Promise.resolve(address);
        }
        if( address.addressInfo == 'Banana' ){
          address.id = 1;
          return Promise.resolve(address);
        }
      });

      const result = await customerAddressService.addAddressToUser(mockInput, "1");

      expect(result.id).toEqual(1);
      expect(result.current).toEqual(true);
      expect(result.addressInfo).toEqual('Banana');
      expect(result.endDate).toEqual(null);
      expect(result.user).toEqual(mockUser);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(customerAddressRepository.findActiveByUser).toHaveBeenCalledWith(1);
      expect(customerAddressRepository.save).toHaveBeenCalledTimes(2);
    });

    it('Fail_UserNotFound', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockInput = new createNewAddressDto();
      mockInput.addressInfo = 'Banana';

      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      const err = await customerAddressService.addAddressToUser(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
      expect(err.message).toContain('User with given UID not found');
    });

    it('Fail_MissingData', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.name = 'Mock User';

      const mockInput = new createNewAddressDto();
      mockInput.addressInfo = '';

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser);

      const err = await customerAddressService.addAddressToUser(mockInput, "1").catch(e => e);
      expect(err).toBeInstanceOf(CustomerAddressInvalidDataException);
      expect(err.message).toContain('The customer address is missing in input data');
    });
  });

});