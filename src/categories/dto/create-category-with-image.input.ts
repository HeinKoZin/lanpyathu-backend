import { Field, InputType, OmitType } from '@nestjs/graphql';
import { Upload } from '@scalars/Upload.scalar';
import { CategoryEntity } from '../entities/category.entity';

@InputType()
export class CreateCategoryWithImageInput extends OmitType(
  CategoryEntity,
  ['id', 'originalImage', 'thumbnailImage', 'createdAt', 'updatedAt'],
  InputType,
) {
  @Field(() => Upload)
  image: Upload;
}
