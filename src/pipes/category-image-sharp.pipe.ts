import { FileUpload } from 'graphql-upload';
import { Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';
import { CreateCategoryWithImageInput } from '@categories/dto/create-category-with-image.input';
import { SetCategoryWithImageInput } from '@categories/dto/set-category.input';
import ShortUniqueId from 'short-unique-id';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

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

      const originalFilePath = `uploaded/original/category_images/${imageName}`;
      const thumbnailsFilePath = `uploaded/thumbnails/category_images/${imageName}`;

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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      Key: key,
      Body: body,
      ContentType: mimetype,
      ACL: 'public-read',
      ContentDisposition: 'inline',
    };

    try {
      const parallelUploads3 = new Upload({
        client: client,
        params: params,

        tags: [
          /*...*/
        ], // optional tags
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      });

      parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
      });

      await parallelUploads3.done();
    } catch (e) {
      console.log(e);
    }
  };
}
