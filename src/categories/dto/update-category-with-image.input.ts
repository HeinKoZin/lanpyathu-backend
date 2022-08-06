import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Upload } from '@scalars/Upload.scalar';
import { CategoryEntity } from '../entities/category.entity';

@InputType()
export class UpdateCategoryWithImageInput extends PartialType(
  OmitType(
    CategoryEntity,
    ['id', 'image', 'createdAt', 'updatedAt'],
    InputType,
  ),
) {
  @Field(() => String)
  id: string;

  @Field(() => Upload, { nullable: true })
  image: Upload;
}
