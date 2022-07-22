import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadResponse {
  @Field(() => Boolean)
  success: boolean;
}
