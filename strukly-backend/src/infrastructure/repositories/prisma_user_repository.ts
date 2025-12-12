import { PrismaClient } from '@prisma/client';
import User from '../../domain/aggregates/user';
import UserRepository from '../../domain/repositories/user_repository';

export default class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

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

  async findById(id: string): Promise<User | null> {
    const dbUser= await this.prisma.user.findUnique({
      where: { id },
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

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id, 
        email: user.email,
        name: user.name,
        hashedPassword: user.hashedPassword,
      },
    });
  }

   async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: user.email,
        name: user.name,
        hashedPassword: user.hashedPassword,
        updatedAt: new Date(), 
      },
    });
  }
}
