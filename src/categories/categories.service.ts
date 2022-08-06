import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateCategoryInput } from './dto/update-category.input';
import { SetCategoryWithImageInput } from './dto/set-category.input';
import { SetUpdatedCategoryWithImageInput } from './dto/set-updated-category.input';
import * as fs from 'fs';

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

  async update(
    id: string,
    updateCategoryInput: SetUpdatedCategoryWithImageInput,
  ) {
    const category = this.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    } else {
      if (updateCategoryInput.image) {
        // update category image
        // delete old image
        const oldImage = (await category).image;

        if (oldImage) {
          // delete old image from uploads folder
          const oldOriginalImagePath = `./uploaded/original/category_images/${oldImage}`;
          const oldThumbnailImagePath = `./uploaded/thumbnails/category_images/${oldImage}`;
          await this.deleteFile(oldOriginalImagePath);
          await this.deleteFile(oldThumbnailImagePath);
        }
      }
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

  async deleteFile(path: string) {
    try {
      await fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
