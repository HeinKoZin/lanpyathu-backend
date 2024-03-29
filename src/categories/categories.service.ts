import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateCategoryInput } from './dto/update-category.input';
import { SetCategoryWithImageInput } from './dto/set-category.input';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: SetCategoryWithImageInput) {
    const category = await this.prismaService.category.create({
      data: {
        ...data,
      },
    });
    return category;
  }

  async findAll() {
    const allCategories = await this.prismaService.category.findMany();

    // pass absolute path to image
    allCategories.forEach((category) => {
      category.image = `${process.env.HOST}:${process.env.PORT}/uploaded/thumbnails/category_images/${category.image}`;
    });

    return allCategories;
  }

  async findOne(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });
    return category;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
    const category = this.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    } else {
      return await this.prismaService.category.update({
        where: {
          id,
        },
        data: {
          ...updateCategoryInput,
        },
      });
    }
  }

  async remove(id: string) {
    const category = this.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    } else {
      return await this.prismaService.category.delete({
        where: {
          id,
        },
      });
    }
  }

  // async createWithImage(data: SetCategoryWithImageInput) {
  //   const category = await this.prismaService.category.create({
  //     data: {
  //       ...data,
  //     },
  //   });
  //   return category;
  // }
}
