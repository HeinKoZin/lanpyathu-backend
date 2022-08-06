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
        const { createReadStream, filename } =
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

        const originalFilePath = `./uploaded/original/category_images/${imageName}`;
        const thumbnailsFilePath = `./uploaded/thumbnails/category_images/${imageName}`;

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
