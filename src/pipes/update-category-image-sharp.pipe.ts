import { FileUpload } from 'graphql-upload';
import { Injectable, PipeTransform } from '@nestjs/common';
// import { Upload } from '@scalars/Upload.scalar';
// import path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { CreateCategoryWithImageInput } from '@categories/dto/create-category-with-image.input';
import { SetCategoryWithImageInput } from '@categories/dto/set-category.input';
import ShortUniqueId from 'short-unique-id';
import { UpdateCategoryWithImageInput } from '@categories/dto/update-category-with-image.input';
import { SetUpdatedCategoryWithImageInput } from '@categories/dto/set-updated-category.input';
import { S3 } from 'aws-sdk';

@Injectable()
export class UpdateCategoryImageSharpPipe
  implements
    PipeTransform<
      UpdateCategoryWithImageInput,
      Promise<SetUpdatedCategoryWithImageInput>
    >
{
  uid = new ShortUniqueId({
    length: 6,
  });

  async transform(
    createCategoryInput: UpdateCategoryWithImageInput,
  ): Promise<SetUpdatedCategoryWithImageInput> {
    // return JSON.stringify(data);
    if (!createCategoryInput.image) {
      const { image, ...rest } = createCategoryInput;
      return rest;
    } else {
      try {
        const { createReadStream, filename, mimetype } =
          (await createCategoryInput?.image) as unknown as FileUpload;

        const stream = createReadStream();
        const transformer = sharp()
          .resize(800)
          .webp({ quality: 70 })
          .toFormat('webp')
          .on('info', function (info) {
            console.log('Image height is ' + info.height);
          });

        // generate a random string for the file name
        // uuidv4 is a function that generates a random string
        const imageName = `${Date.now()}-${this.uid()}-category.${filename
          .split('.')
          .pop()}`;

        const originalDir = 'uploaded/original/category_images/';
        const thumbnailDir = 'uploaded/thumbnails/category_images/';
        const originalFilePath = originalDir + imageName;
        const thumbnailsFilePath = thumbnailDir + imageName;

        // stream to buffer

        const s3 = new S3({
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
          endpoint: process.env.ENDPOINT,
          s3ForcePathStyle: true,
          signatureVersion: 'v4',
        });

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

            await s3
              .upload({
                ACL: 'public-read',
                ContentType: mimetype,
                ContentDisposition: 'inline',
                Bucket: process.env.S3_BUCKET,
                Body: buffer,
                Key: originalFilePath,
              })
              .promise();

            await s3
              .upload({
                ACL: 'public-read',
                ContentType: mimetype,
                ContentDisposition: 'inline',
                Bucket: process.env.S3_BUCKET,
                Body: compressedImage,
                Key: thumbnailsFilePath,
              })
              .promise();
          })
          .on('error', (err) => {
            console.log(err);
          })
          .on('finish', () => {
            console.log('finished');
          });

        // create the directories if they don't exist
        if (!fs.existsSync(originalDir)) {
          console.log('originalDir does not exist');
          await fs.mkdirSync(originalDir, { recursive: true });
        }
        if (!fs.existsSync(thumbnailDir)) {
          await fs.mkdirSync(thumbnailDir, { recursive: true });
        }

        stream.pipe(fs.createWriteStream(originalFilePath));
        stream.pipe(transformer).pipe(fs.createWriteStream(thumbnailsFilePath));

        const { image, ...setData } = createCategoryInput;

        return { ...setData, image: imageName };
      } catch (err) {
        console.log(err);
        throw new Error('Error while uploading image');
      }
    }
  }
}
