import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CategoryEntity } from '../entities/category.entity';

@InputType()
export class SetUpdatedCategoryWithImageInput extends PartialType(
  OmitType(CategoryEntity, ['id', 'createdAt', 'updatedAt'], InputType),
) {
  @Field(() => String)
  id: string;
}
