import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSayartawInput } from './dto/create-sayartaw.input';
import { UpdateSayartawInput } from './dto/update-sayartaw.input';

@Injectable()
export class SayartawsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSayartawInput: CreateSayartawInput) {
    const createdSayartaw = await this.prismaService.sayartaw.create({
      data: {
        ...createSayartawInput,
      },
    });
    return createdSayartaw;
  }

  async findAll() {
    const allSayartaws = await this.prismaService.sayartaw.findMany();
    return allSayartaws;
  }

  async findOne(id: string) {
    const sayartaw = await this.prismaService.sayartaw.findUnique({
      where: {
        id,
      },
    });
    return sayartaw;
  }

  async update(id: string, updateSayartawInput: UpdateSayartawInput) {
    const sayartaw = this.findOne(id);

    if (!sayartaw) {
      throw new Error('Sayartaw not found');
    } else {
      return await this.prismaService.sayartaw.update({
        where: {
          id,
        },
        data: {
          ...updateSayartawInput,
        },
      });
    }
  }

  async remove(id: string) {
    const sayartaw = this.findOne(id);

    if (!sayartaw) {
      throw new Error('Sayartaw not found');
    } else {
      return await this.prismaService.sayartaw.delete({
        where: {
          id,
        },
      });
    }
  }
}
