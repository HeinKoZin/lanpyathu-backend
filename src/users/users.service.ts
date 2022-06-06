import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const checkExistUser = this.findOne(createUserInput.email);

    if (checkExistUser) {
      throw new Error('User already exist');
    } else {
      return this.prismaService.user.create({
        data: {
          ...createUserInput,
          role: 'USER',
        },
      });
    }
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(id?: string, email?: string) {
    // find user by id or email
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
        email: email,
      },
    });

    return user;
  }

  update(updateUserInput: UpdateUserInput) {
    const user = this.findOne(updateUserInput.id);

    if (!user) {
      throw new Error('User not found');
    } else {
      return this.prismaService.user.update({
        where: {
          id: updateUserInput.id,
        },
        data: {
          ...updateUserInput,
        },
      });
    }
  }

  remove(id: string) {
    const user = this.findOne(id);

    if (!user) {
      throw new Error('User not found');
    } else {
      return this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
    }
  }
}
