import { ObjectType, Field } from '@nestjs/graphql';
import { Tayartaw } from '@prisma/client';

@ObjectType()
export class TayartawEntity implements Tayartaw {
  @Field(() => String, { description: 'Tayartaw ID' })
  id: string;

  @Field(() => String, { description: 'Tayartaw Title' })
  title: string;

  @Field(() => String, { description: 'Tayartaw Cover' })
  cover: string;

  @Field(() => String, { description: 'Tayartaw Path' })
  path: string;

  @Field(() => String, { description: 'Tayartaw Description' })
  description: string;

  @Field(() => String, { description: 'Sayartaw ID' })
  sayartawId: string;

  @Field(() => String, { description: 'Tayartaw CreatedAt' })
  createdAt: Date;

  @Field(() => String, { description: 'Tayartaw UpdatedAt' })
  updatedAt: Date;
}
