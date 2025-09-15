import { UserRepository } from "../../domain/repositories/user_repository";
import User from "../../domain/aggregates/user";
import { v4 as uuidv4 } from 'uuid';
import { HashingService } from "../../domain/ports/hashing_service_port";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService
  ) {}

  async execute(email: string, password: string, name: string): Promise<void> {
    const exist = await this.userRepository.findByEmail(email);
    if (exist) {
      throw new Error('email has been taken');
    }

    const hashedPassword = await this.hashingService.hash(password);

    const user = new User({
      id: uuidv4(),
      email: email,
      name: name,
      hashedPassword: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.save(user);
  }
}