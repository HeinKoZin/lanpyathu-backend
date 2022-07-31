import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
// import { UploadUserProfilePicInput } from './dto/upload-user-photo.input';
// import { createWriteStream } from 'fs';
// import { FileUpload as TestUpload, GraphQLUpload } from 'graphql-upload';
// import { UploadResponse } from './dto/upload.response';
// import * as fs from 'fs';
import { UploadUserProfilePicInput } from './dto/upload-user-photo.input';
import { UploadResponse } from './dto/upload.response';
import { ProfileImageSharpPipe } from '@pipes/profile-image-sharp.pipe';
import { UploadedUserProfilePicResponse } from './dto/uploaded-user-profile-pic.response';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserEntity)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [UserEntity], { name: 'users', description: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => UserEntity, {
    name: 'user',
    description: 'Find user by id or email',
  })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => UserEntity)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput);
  }

  @Mutation(() => UserEntity)
  removeUser(@Args('id', { type: () => Int }) id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => UploadResponse, { name: 'uploadUserProfilePic' })
  async uploadUserPic(
    @Args('uploadUserProfilePicInput')
    uploadUserProfilePicInput: UploadUserProfilePicInput,
  ) {
    return await this.usersService.uploadUserPic(uploadUserProfilePicInput);
  }

  // @Mutation(() => Boolean, { name: 'coverPhoto' })
  // async uploadCoverPhoto(
  //   @Args('file', { type: () => GraphQLUpload })
  //   { filename, createReadStream }: FileUpload,
  // ): Promise<boolean> {
  //   const filePath = `./uploaded/cover-photos/${filename}`;
  //   const stream = createReadStream();
  //   return await new Promise((resolve, reject) =>
  //     stream
  //       .pipe(fs.createWriteStream(filePath))
  //       .on('finish', () => resolve(true))
  //       .on('error', () => reject(false)),
  //   );
  // }

  @Mutation(() => UploadResponse, { name: 'uploadCoverPhoto' })
  async uploadCoverPhoto(
    @Args(
      'data',
      { type: () => UploadUserProfilePicInput },
      ProfileImageSharpPipe,
    )
    data: UploadedUserProfilePicResponse,
  ) {
    return await this.usersService.setUserProfilePic(data);
  }
}
