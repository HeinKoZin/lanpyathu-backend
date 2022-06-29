import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';

@ObjectType()
export class UserErrorResponse {
  @Field(() => String)
  message: string;
}

export const UserResponse = createUnionType({
  name: 'UserResponse',
  types: () => [UserErrorResponse, UserEntity] as const,
  resolveType: (value) => {
    if (value.message) {
      return UserErrorResponse;
    }
    return UserEntity;
  },
});
