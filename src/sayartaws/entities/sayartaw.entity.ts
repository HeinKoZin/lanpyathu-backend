import { ObjectType, Field } from '@nestjs/graphql';
import { Sayartaw } from '@prisma/client';

@ObjectType()
export class SayartawEntity implements Sayartaw {
  @Field(() => String, { description: 'Sayartaw ID' })
  id: string;

  @Field(() => String, { description: 'Sayartaw name' })
  name: string;

  @Field(() => String, { description: 'Sayartaw cover' })
  cover: string;

  @Field(() => String, { description: 'Sayartaw bio' })
  bio: string;

  @Field(() => String, { description: 'Sayartaw createdAt' })
  createdAt: Date;

  @Field(() => String, { description: 'Sayartaw updatedAt' })
  updatedAt: Date;
}
