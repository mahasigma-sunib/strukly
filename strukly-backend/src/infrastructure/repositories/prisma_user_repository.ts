import { PrismaClient } from '@prisma/client';
import User from '../../domain/aggregates/user';
import { UserRepository } from '../../domain/repositories/user_repository';

export class PrismaUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  async findByEmail(email: string): Promise<User | null> {
    const dbUser= await this.prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      return null;
    }

    return new User({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      hashedPassword: dbUser.hashedPassword,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt
    })
  }

  async save(user: User): Promise<void> {
    if (user.id) {
      // existing user
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email,
          name: user.name,
          hashedPassword: user.hashedPassword,
          updatedAt: new Date(),
        },
      });
    } else {
      // new user
      await this.prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          hashedPassword: user.hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
}