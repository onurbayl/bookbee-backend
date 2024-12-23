import { Test, TestingModule } from "@nestjs/testing";
import { FriendRequestForbiddenException } from "src/app/friend-request/exceptions/friend-request-forbidden.exception";
import { FriendRequest } from "src/app/friend-request/friend-request.entity";
import { FriendRequestRepository } from "src/app/friend-request/friend-request.repository";
import { FriendRequestService } from "src/app/friend-request/friend-request.service";
import { UserNotFoundException } from "src/app/user/exceptions/user-not-found.exception";
import { User } from "src/app/user/user.entity";
import { UserRepository } from "src/app/user/user.repository";

describe('FriendRequestService', () => {
  let friendRequestService: FriendRequestService;
  let friendRequestRepository: Partial<FriendRequestRepository>;
  let userRepository: Partial<UserRepository>;

  beforeEach(async () => {
    userRepository = {
      findByUId: jest.fn(),
      findById: jest.fn()
    };

    friendRequestRepository = {
      findFriends: jest.fn(),
      findByUserAndTarget: jest.fn(),
      save: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRequestService,
        { provide: FriendRequestRepository, useValue: friendRequestRepository },
        { provide: UserRepository, useValue: userRepository }
      ]
    }).compile();

    friendRequestService = module.get<FriendRequestService>(FriendRequestService);
  });

  describe('getFriends', () => {
    it('Success', async () => {
      const mockUser1 = new User();
      mockUser1.id = 1;

      const mockUser2 = new User();
      mockUser2.id = 2;

      const mockUser3 = new User();
      mockUser3.id = 3;

      const mockFriendRequest1 = new FriendRequest();
      mockFriendRequest1.id = 1;
      mockFriendRequest1.sender = mockUser1;
      mockFriendRequest1.receiver = mockUser2;
      mockFriendRequest1.dateAnswered = new Date();

      const mockFriendRequest2 = new FriendRequest();
      mockFriendRequest2.id = 2;
      mockFriendRequest2.sender = mockUser3;
      mockFriendRequest2.receiver = mockUser1;
      mockFriendRequest2.dateAnswered = new Date();
      
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser1);
      (friendRequestRepository.findFriends as jest.Mock).mockResolvedValue([mockFriendRequest1, mockFriendRequest2]);
      
      const result = await friendRequestService.getFriends("1");
      const expectedResult = [mockUser2, mockUser3];

      expect(result).toEqual(expectedResult);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(friendRequestRepository.findFriends).toHaveBeenCalledWith(1);
    });

    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      await expect(friendRequestService.getFriends("1")).rejects.toThrow(UserNotFoundException);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });
  });

  describe('sendRequest', () => {
    it('Success_NewFriendship', async () => {
      const mockUser1 = new User();
      mockUser1.id = 1;

      const mockUser2 = new User();
      mockUser2.id = 2;

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser1);
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser2);
      (friendRequestRepository.findByUserAndTarget as jest.Mock).mockResolvedValue(null);
      (friendRequestRepository.save as jest.Mock).mockResolvedValue(null);

      const result = await friendRequestService.sendRequest("1", 2);
      const expectedResult = new Date();

      expect(result).toEqual(expectedResult);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(userRepository.findById).toHaveBeenCalledWith(2);
      expect(friendRequestRepository.findByUserAndTarget).toHaveBeenCalledWith(1, 2);
    });

    it('Success_AlreadyExists', async () => {
      const mockUser1 = new User();
      mockUser1.id = 1;

      const mockUser2 = new User();
      mockUser2.id = 2;

      const mockFriendRequest = new FriendRequest();
      mockFriendRequest.id = 1;
      mockFriendRequest.sender = mockUser1;
      mockFriendRequest.receiver = mockUser2;
      mockFriendRequest.dateRequest = new Date("2022-02-20");
      mockFriendRequest.dateAnswered = null;

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser1);
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser2);
      (friendRequestRepository.findByUserAndTarget as jest.Mock).mockResolvedValue(mockFriendRequest);

      const result = await friendRequestService.sendRequest("1", 2);
      const expectedResult = new Date("2022-02-20");

      expect(result).toEqual(expectedResult);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(userRepository.findById).toHaveBeenCalledWith(2);
      expect(friendRequestRepository.findByUserAndTarget).toHaveBeenCalledWith(1, 2);
    });

    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      const err = await friendRequestService.sendRequest("1", 2).catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
      expect(err.message).toContain('User with given UID not found');

      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });

    it('Fail_ReceiverNotExists', async () => {
      const mockUser1 = new User();
      mockUser1.id = 1;

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser1);
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      const err = await friendRequestService.sendRequest("1", 2).catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
      expect(err.message).toContain('User with ID 2 not found');

      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(userRepository.findById).toHaveBeenCalledWith(2);
    });
  });

  describe('acceptRequest', () => {
    it('Success', async () => {
      const mockUser1 = new User();
      mockUser1.id = 1;

      const mockUser2 = new User();
      mockUser2.id = 2;

      const mockFriendRequest = new FriendRequest();
      mockFriendRequest.id = 1;
      mockFriendRequest.sender = mockUser1;
      mockFriendRequest.receiver = mockUser2;
      mockFriendRequest.dateRequest = new Date("2022-02-20");
      mockFriendRequest.dateAnswered = null;

      const mockFriendRequestUpdate = new FriendRequest();
      mockFriendRequestUpdate.id = 1;
      mockFriendRequestUpdate.sender = mockUser1;
      mockFriendRequestUpdate.receiver = mockUser2;
      mockFriendRequestUpdate.dateRequest = new Date("2022-02-20");
      mockFriendRequestUpdate.dateAnswered = new Date();
      
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser1);
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser2);
      (friendRequestRepository.findByUserAndTarget as jest.Mock).mockResolvedValue(mockFriendRequest);
      (friendRequestRepository.save as jest.Mock).mockResolvedValue(mockFriendRequestUpdate);
      
      const result = await friendRequestService.acceptRequest("1", 2);
      const expectedResult = mockFriendRequestUpdate.dateAnswered;

      expect(result).toEqual(expectedResult);
      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(userRepository.findById).toHaveBeenCalledWith(2);
      expect(friendRequestRepository.findByUserAndTarget).toHaveBeenCalledWith(1, 2);
      expect(friendRequestRepository.save).toHaveBeenCalledWith(mockFriendRequestUpdate);
    });

    it('Fail_UserNotFound', async () => {
      (userRepository.findByUId as jest.Mock).mockResolvedValue(null);

      const err = await friendRequestService.sendRequest("1", 2).catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
      expect(err.message).toContain('User with given UID not found');

      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
    });

    it('Fail_ReceiverNotExists', async () => {
      const mockUser1 = new User();
      mockUser1.id = 1;

      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser1);
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      const err = await friendRequestService.sendRequest("1", 2).catch(e => e);
      expect(err).toBeInstanceOf(UserNotFoundException);
      expect(err.message).toContain('User with ID 2 not found');

      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(userRepository.findById).toHaveBeenCalledWith(2);
    });

    it('Fail_AlreadyFriends', async () => {
      const mockUser1 = new User();
      mockUser1.id = 1;

      const mockUser2 = new User();
      mockUser2.id = 2;

      const mockFriendRequest = new FriendRequest();
      mockFriendRequest.id = 1;
      mockFriendRequest.sender = mockUser1;
      mockFriendRequest.receiver = mockUser2;
      mockFriendRequest.dateRequest = new Date("2022-02-20");
      mockFriendRequest.dateAnswered = new Date("2022-03-23");
      
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser1);
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser2);
      (friendRequestRepository.findByUserAndTarget as jest.Mock).mockResolvedValue(mockFriendRequest);
      
      const err = await friendRequestService.acceptRequest("1", 2).catch(e => e);
      expect(err).toBeInstanceOf(FriendRequestForbiddenException);
      expect(err.message).toContain('Friendship between sender with ID 1 and receiver with ID 2 already established');

      expect(userRepository.findByUId).toHaveBeenCalledWith("1");
      expect(userRepository.findById).toHaveBeenCalledWith(2);
      expect(friendRequestRepository.findByUserAndTarget).toHaveBeenCalledWith(1, 2);
    });
  });
});