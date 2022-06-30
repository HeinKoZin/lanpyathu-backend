import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@users/entities/user.entity';

@ObjectType()
export class LoginResponse {
  @Field(() => String, { nullable: false, description: 'User token' })
  token: string;

  @Field(() => UserEntity, { nullable: false, description: 'User data' })
  user: UserEntity;
}

// @ObjectType()
// export class LoginErrorResponse {
//   @Field(() => String, { nullable: false, description: 'Error message' })
//   message: string;
// }

// export const LoginResponse = createUnionType({
//   name: 'LoginResponse',
//   types: () => [LoginSuccessResponse, LoginErrorResponse],
//   resolveType: (value) => {
//     if (value.token) {
//       return LoginSuccessResponse;
//     }
//     return LoginErrorResponse;
//   },
// });
