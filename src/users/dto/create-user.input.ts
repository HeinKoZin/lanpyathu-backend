import { UserEntity } from './../entities/user.entity';
import { InputType, Int, Field, OmitType, ArgsType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class CreateUserInput extends OmitType(
  UserEntity,
  ['id', 'role', 'createdAt', 'updatedAt'] as const,
  InputType,
) {
  @Field(() => String)
  password: string;
}
