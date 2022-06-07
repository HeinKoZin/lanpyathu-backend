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
    const allTayartaws = await this.prismaService.tayartaw.findMany();
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

    if (!tayartaw) {
      throw new Error('Tayartaw not found');
    } else {
      return await this.prismaService.tayartaw.update({
        where: {
          id: updateTayartawInput.id,
        },
        data: {
          ...updateTayartawInput,
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
