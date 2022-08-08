import { FileUpload } from 'graphql-upload';
import { Injectable, PipeTransform } from '@nestjs/common';
// import { Upload } from '@scalars/Upload.scalar';
// import path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { CreateCategoryWithImageInput } from '@categories/dto/create-category-with-image.input';
import { SetCategoryWithImageInput } from '@categories/dto/set-category.input';
import ShortUniqueId from 'short-unique-id';
import { S3 } from 'aws-sdk';

@Injectable()
export class CategoryImageSharpPipe
  implements
    PipeTransform<
      CreateCategoryWithImageInput,
      Promise<SetCategoryWithImageInput>
    >
{
  uid = new ShortUniqueId({
    length: 6,
  });

  async transform(
    createCategoryInput: CreateCategoryWithImageInput,
  ): Promise<SetCategoryWithImageInput> {
    // return JSON.stringify(data);
    try {
      const { createReadStream, filename, mimetype } =
        (await createCategoryInput.image) as unknown as FileUpload;

      const stream = createReadStream();

      // generate a random string for the file name
      // uuidv4 is a function that generates a random string
      const imageName = `${Date.now()}-${this.uid()}-category.${filename
        .split('.')
        .pop()}`;

      const originalDir = 'uploaded/original/category_images/';
      const thumbnailDir = 'uploaded/thumbnails/category_images/';
      const originalFilePath = originalDir + imageName;
      const thumbnailsFilePath = thumbnailDir + imageName;

      const bufferArray: any = [];

      stream
        .on('data', (chunk) => {
          bufferArray.push(chunk);
        })
        .on('end', async () => {
          const buffer = Buffer.concat(bufferArray);
          const compressedImage = sharp(buffer)
            .resize(800)
            .webp({ quality: 60 });

          // upload to s3
          await this.uploadImage(originalFilePath, buffer, mimetype);
          await this.uploadImage(thumbnailsFilePath, compressedImage, mimetype);
        })
        .on('error', (err) => {
          console.log(err);
        })
        .on('finish', () => {
          console.log('finished');
        });

      const { image, ...setData } = createCategoryInput;

      return {
        ...setData,
        originalImage: originalFilePath,
        thumbnailImage: thumbnailsFilePath,
      };
    } catch (err) {
      console.log(err);
      throw new Error('Error while uploading image');
    }
  }

  uploadImage = async (
    key: string,
    body: Buffer | sharp.Sharp,
    mimetype: string,
  ) => {
    const s3 = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      endpoint: process.env.ENDPOINT,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });

    await s3
      .upload({
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        Bucket: process.env.S3_BUCKET,
        Body: body,
        Key: key,
      })
      .promise();
  };
}
