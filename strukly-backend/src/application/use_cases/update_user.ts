import UserRepository from "../../domain/repositories/user_repository";
import HashingService from "../../domain/services/hashing_service";

export default class UpdateUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService
  ) {}

  async execute(
    userId: string,
    data: {
      name?: string;
      email?: string;
      password?: { previous: string; new: string };
    }
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('user not found');
    }

    const { password, ...profileData } = data;

    if (password) {
      const isPasswordMatch = await this.hashingService.compare(
        password.previous,
        user.hashedPassword
      );

      if (!isPasswordMatch) {
        throw new Error("previous password does not match");
      }

      const newHashedPassword = await this.hashingService.hash(
        password.new
      );
      user.updateProfile({ ...profileData, password: newHashedPassword });
    } else {
      user.updateProfile({ ...profileData });
    }

    await this.userRepository.update(user);
  }
}