import UserRepository from "../../domain/repositories/user_repository";

export default class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    data: { name?: string; email?: string }
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('user not found');
    }

    user.updateProfile(data);

    await this.userRepository.update(user);
  }
}