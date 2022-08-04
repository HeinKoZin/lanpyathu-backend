import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CategoryImageEntity {
  @Field(() => String)
  original: string;

  @Field(() => String)
  thumbnail: string;
}
