// import { FileUpload } from 'graphql-upload';
import { InputType, Field, PickType } from '@nestjs/graphql';
import { Upload } from '@scalars/Upload.scalar';
import { UpdateUserInput } from './update-user.input';

@InputType()
export class UploadUserProfilePicInput extends PickType(UpdateUserInput, [
  'id',
]) {
  @Field(() => Upload)
  photo: Upload;
}
