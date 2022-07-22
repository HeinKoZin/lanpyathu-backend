import { FileUpload } from './../node_modules/@types/graphql-upload/index.d';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Upload } from '@scalars/Upload.scalar';
import path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class ImageSharpPipe
  implements PipeTransform<FileUpload, Promise<string>>
{
  async transform(
    photo: FileUpload,
    metadata: ArgumentMetadata,
  ): Promise<string> {
    try {
      const { createReadStream } = await photo;

      const stream = createReadStream();
      const transformer = sharp()
        .resize(800)
        .webp({ quality: 70 })
        .toFormat('webp')
        .on('info', function (info) {
          console.log('Image height is ' + info.height);
        });

      const filePath = `./uploaded/user_profile_pics/${photo.filename}`;

      stream.pipe(transformer).pipe(fs.createWriteStream(filePath));

      return 'base64.length';
    } catch (err) {
      console.log(err);
      return 'd';
    }
  }
}
