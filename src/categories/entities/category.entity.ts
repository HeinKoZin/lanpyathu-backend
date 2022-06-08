import { ObjectType, Field } from '@nestjs/graphql';
import { Category } from '@prisma/client';

@ObjectType()
export class CategoryEntity implements Category {
  @Field(() => String)
  id: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  parentId: string;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
