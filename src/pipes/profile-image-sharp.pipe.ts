import { FileUpload } from 'graphql-upload';
import { Injectable, PipeTransform } from '@nestjs/common';
// import { Upload } from '@scalars/Upload.scalar';
// import path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { UploadUserProfilePicInput } from '@users/dto/upload-user-photo.input';
import { UploadedUserProfilePicResponse } from '@users/dto/uploaded-user-profile-pic.response';

@Injectable()
export class ProfileImageSharpPipe
  implements
    PipeTransform<
      UploadUserProfilePicInput,
      Promise<{ id: string; photo: string }>
    >
{
  async transform(
    data: UploadUserProfilePicInput,
  ): Promise<UploadedUserProfilePicResponse> {
    // return JSON.stringify(data);
    try {
      const { createReadStream, filename } =
        (await data.photo) as unknown as FileUpload;

      const stream = createReadStream();
      const transformer = sharp()
        .resize(800)
        .webp({ quality: 70 })
        .toFormat('webp')
        .on('info', function (info) {
          console.log('Image height is ' + info.height);
        });

      const filePath = `./uploaded/user_profile_pics/${filename}`;

      stream.pipe(transformer).pipe(fs.createWriteStream(filePath));

      return { photo: filename, id: data.id };
    } catch (err) {
      console.log(err);
      throw new Error('Error while uploading image');
    }
  }
}
