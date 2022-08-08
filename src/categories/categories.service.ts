import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateCategoryInput } from './dto/update-category.input';
import { SetCategoryWithImageInput } from './dto/set-category.input';
import { SetUpdatedCategoryWithImageInput } from './dto/set-updated-category.input';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';

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

    allCategories.forEach(async (category) => {
      const originalImage = (await category).originalImage;
      const thumbnailImage = (await category).thumbnailImage;
      if (originalImage && thumbnailImage) {
        category.originalImage = this.getImageUrl(originalImage);
        category.thumbnailImage = this.getImageUrl(thumbnailImage);
      }
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

  async update(
    id: string,
    updateCategoryInput: SetUpdatedCategoryWithImageInput,
  ) {
    const category = this.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    } else {
      if (
        updateCategoryInput.originalImage &&
        updateCategoryInput.thumbnailImage
      ) {
        // update category image
        // delete old image
        const oldOriginalImage = (await category).originalImage;
        const oldThumbnailImage = (await category).thumbnailImage;

        if (oldOriginalImage && oldThumbnailImage) {
          // delete old image from uploads folder
          // const oldOriginalImagePath = `./uploaded/original/category_images/${oldImage}`;
          // const oldThumbnailImagePath = `./uploaded/thumbnails/category_images/${oldImage}`;
          await this.deleteFile(oldOriginalImage);
          await this.deleteFile(oldThumbnailImage);
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
      const s3 = new S3({
        endpoint: process.env.ENDPOINT,
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      });

      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: path,
      };

      await s3.deleteObject(params).promise();
    } catch (error) {
      console.log(error);
    }
  }

  getImageUrl(path: string) {
    const s3 = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      endpoint: process.env.ENDPOINT,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: path,
    };

    const url = s3.getSignedUrl('getObject', params);
    return url;
  }
}
