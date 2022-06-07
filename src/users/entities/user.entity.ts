import {
  ObjectType,
  Field,
  registerEnumType,
  HideField,
} from '@nestjs/graphql';
import { User, UserRole } from '@prisma/client';

// @ObjectType()
// export class User {
//   @Field(() => Int, { description: 'Example field (placeholder)' })
//   exampleField: number;
// }

@ObjectType()
export class UserEntity implements User {
  @Field(() => String, { description: "User's ID" })
  id: string;

  @Field(() => String, { description: "User's name" })
  name: string;

  @Field(() => String, { description: "User's email" })
  email: string;

  @HideField()
  password: string;

  @Field(() => UserRole, { description: "User's role" })
  role: UserRole;

  @Field(() => String, { description: "User's createdAt" })
  createdAt: Date;

  @Field(() => String, { description: "User's updatedAt" })
  updatedAt: Date;
}

// register enum type
registerEnumType(UserRole, {
  name: 'UserRole',
});
