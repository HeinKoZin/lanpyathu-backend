import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { SetCategoryWithImageInput } from './dto/set-category.input';
import { SetUpdatedCategoryWithImageInput } from './dto/set-updated-category.input';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

    // all categories with image
    const categoriesWithImage = await Promise.all(
      allCategories.map(async (category) => {
        const originalImage = await this.getImageUrl(category.originalImage);
        const thumbnailImage = await this.getImageUrl(category.thumbnailImage);
        return {
          ...category,
          originalImage,
          thumbnailImage,
        };
      }),
    );

    return categoriesWithImage;
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

  async deleteFile(path: string) {
    try {
      const client = new S3Client({
        region: 'ap1',
        endpoint: process.env.ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
        },
      });
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: path,
      };

      await client.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.log(error);
    }
  }

  async getImageUrl(path: string) {
    const client = new S3Client({
      region: 'ap1',
      endpoint: process.env.ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
    });

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: path,
    };

    const url = await getSignedUrl(client, new GetObjectCommand(params));
    return url;
  }
}
