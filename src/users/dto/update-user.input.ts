import { CreateUserInput } from './create-user.input';
import {
  InputType,
  Field,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  id: string;

  @Field(() => UserRole)
  role?: UserRole;
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role',
});
