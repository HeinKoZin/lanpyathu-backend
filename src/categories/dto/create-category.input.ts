import { InputType, OmitType } from '@nestjs/graphql';
import { CategoryEntity } from '../entities/category.entity';

@InputType()
export class CreateCategoryInput extends OmitType(
  CategoryEntity,
  ['id', 'createdAt', 'updatedAt'],
  InputType,
) {}
