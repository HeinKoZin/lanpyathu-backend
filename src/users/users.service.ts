import { UploadedUserProfilePicResponse } from './dto/uploaded-user-profile-pic.response';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UploadUserProfilePicInput } from './dto/upload-user-photo.input';
// import { UploadUserProfilePicInput } from './dto/upload-user-photo.input';
import * as fs from 'fs';
import * as sharp from 'sharp';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const checkExistUser = await this.prismaService.user.findUnique({
      where: {
        email: createUserInput.email,
      },
    });

    if (checkExistUser) {
      throw new Error('User already exist');
    } else {
      return await this.prismaService.user.create({
        data: {
          ...createUserInput,
          role: 'USER',
        },
      });
    }
  }

  async findAll() {
    // return all users with photo url istead of photo name
    const users = await this.prismaService.user.findMany({});
    return users.map((user) => {
      // return user with photo url instead of photo name
      return {
        ...user,
        photo: `${process.env.HOST}:${process.env.PORT}/uploaded/user_profile_pics/${user.photo}`,
      };
    });
  }

  async findOne(id?: string, email?: string) {
    // find user by id or email
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
        email: email,
      },
    });
    console.log(user);

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    return user;
  }

  // Login user
  async findOneByEmail(email?: string) {
    // find user by id or email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async update(updateUserInput: UpdateUserInput) {
    const user = await this.findOne(updateUserInput.id);

    if (!user) {
      throw new Error('User not found');
    } else {
      return this.prismaService.user.update({
        where: {
          id: updateUserInput.id,
        },
        data: {
          ...updateUserInput,
        },
      });
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('User not found');
    } else {
      return this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
    }
  }

  async uploadUserPic(uploadUserProfilePicInput: UploadUserProfilePicInput) {
    const user = await this.findOne(uploadUserProfilePicInput.id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const { filename, createReadStream } =
        (await uploadUserProfilePicInput.photo) as unknown as FileUpload;
      const name = `${Date.now()}-${user.id}.${filename.split('.').pop()}`;
      const filePath = `./uploaded/user_profile_pics/${name}`;
      const stream = createReadStream();

      // Compress Image with sharp
      const transformer = sharp()
        .resize(600)
        .webp({ quality: 60 })
        .toFormat('webp')
        .on('info', function (info) {
          console.log('Image height is ' + info.height);
        });

      return await new Promise((resolve, reject) =>
        stream
          .pipe(transformer)
          .pipe(fs.createWriteStream(filePath))
          .on('finish', async () => {
            await this.prismaService.user.update({
              where: {
                id: uploadUserProfilePicInput.id,
              },
              data: {
                photo: name,
              },
            });
            resolve({ success: true });
          })
          .on('error', () => {
            reject({ success: false });
          }),
      );
    }
  }

  async setUserProfilePic(data: UploadedUserProfilePicResponse) {
    console.log(data);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!user) {
      // delete file from uploaded folder
      fs.unlink(
        path.join(__dirname, '../../uploaded/user_profile_pics', data.photo),
        (err) => {
          if (err) throw new Error(err.message);
          console.log('successfully deleted');
        },
      );

      throw new Error('User not found');
    } else {
      // rename file from uploaded folder
      if (user.photo) {
        // delete image if user photo is already exist in uploaded folder
        fs.stat(
          path.join(__dirname, '../../uploaded/user_profile_pics', user.photo),
          (err, stats) => {
            if (stats) {
              fs.unlink(
                path.join(
                  __dirname,
                  '../../uploaded/user_profile_pics',
                  user.photo,
                ),
                (err) => {
                  if (err) throw new Error(err.message);
                  console.log('successfully deleted');
                },
              );
            }
          },
        );
      }

      const filename = `${Date.now()}-${user.id}.${data.photo
        .split('.')
        .pop()}`;

      fs.rename(
        path.join(__dirname, '../../uploaded/user_profile_pics', data.photo),
        path.join(__dirname, '../../uploaded/user_profile_pics', filename),
        async (err) => {
          if (err) throw new Error(err.message);
          console.log('successfully renamed');
          await this.prismaService.user.update({
            where: {
              id: data.id,
            },
            data: {
              photo: filename,
            },
          });
        },
      );

      return {
        success: true,
      };
    }
  }
}
