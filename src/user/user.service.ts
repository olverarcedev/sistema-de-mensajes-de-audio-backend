import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) { }
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async getUser(id: number): Promise<User> {
    return this.prisma.user.findFirst({ where: { id } });
  }
  async getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email }
    });
  }
  async createUser(name: string, email: string, iconSrc: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        name, email, iconSrc
      }
    });
  }

}
