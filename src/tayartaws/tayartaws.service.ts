import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTayartawInput } from './dto/create-tayartaw.input';
import { UpdateTayartawInput } from './dto/update-tayartaw.input';

@Injectable()
export class TayartawsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTayartawInput: CreateTayartawInput) {
    const createdTayartaw = await this.prismaService.tayartaw.create({
      data: {
        ...createTayartawInput,
      },
    });
    return createdTayartaw;
  }

  async findAll() {
    const allTayartaws = await this.prismaService.tayartaw.findMany({
      include: { categories: true },
    });
    return allTayartaws;
  }

  async findOne(id: string) {
    const tayartaw = await this.prismaService.tayartaw.findUnique({
      where: {
        id: id,
      },
    });
    return tayartaw;
  }

  async update(updateTayartawInput: UpdateTayartawInput) {
    const tayartaw = await this.findOne(updateTayartawInput.id);
    // const categoryIds = updateTayartawInput.categoryIds;

    if (!tayartaw) {
      throw new Error('Tayartaw not found');
    } else {
      return await this.prismaService.tayartaw.update({
        where: {
          id: updateTayartawInput.id,
        },

        data: {
          title: updateTayartawInput.title,
          description: updateTayartawInput.description,
          cover: updateTayartawInput.cover,
          sayartawId: updateTayartawInput.sayartawId,
          path: updateTayartawInput.path,
          categories: {
            connect: updateTayartawInput.categoryIds.map((category) => ({
              id: category,
            })),
          },
        },
        include: {
          categories: true,
        },
      });
    }
  }

  async remove(id: string) {
    const tayartaw = await this.findOne(id);

    if (!tayartaw) {
      throw new Error('Tayartaw not found');
    } else {
      return await this.prismaService.tayartaw.delete({
        where: {
          id: id,
        },
      });
    }
  }

  async findAllBySayartawID(sayartawID: string) {
    const tayartaws = await this.prismaService.tayartaw.findMany({
      where: {
        sayartawId: sayartawID,
      },
    });
    return tayartaws;
  }
}
