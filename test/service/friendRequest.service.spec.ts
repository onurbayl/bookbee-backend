import { Test, TestingModule } from "@nestjs/testing";
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
    };

    friendRequestRepository = {
      findFriends: jest.fn(),
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

      const expectedResult = [mockFriendRequest1, mockFriendRequest2];
      
      (userRepository.findByUId as jest.Mock).mockResolvedValue(mockUser1);
      (friendRequestRepository.findFriends as jest.Mock).mockResolvedValue([mockFriendRequest1, mockFriendRequest2]);

      const result = await friendRequestService.getFriends("1");

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
});