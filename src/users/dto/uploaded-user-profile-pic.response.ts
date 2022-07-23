// import { FileUpload } from 'graphql-upload';
import { InputType, Field, PickType } from '@nestjs/graphql';
import { UpdateUserInput } from './update-user.input';

@InputType()
export class UploadedUserProfilePicResponse extends PickType(UpdateUserInput, [
  'id',
]) {
  @Field(() => String)
  photo: string;
}
