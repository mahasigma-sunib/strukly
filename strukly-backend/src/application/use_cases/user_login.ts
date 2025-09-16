import UserRepository from "../../domain/repositories/user_repository";
import HashingService from "../../domain/services/hashing_service";
import User from "../../domain/aggregates/user";

export default class LoginUserUseCase{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('unauthorized access');
    }

    const ok = await this.hashingService.compare(password, user.hashedPassword)
    if (!ok){
      throw new Error('unauthorized access')
    }

    return user
  }
}