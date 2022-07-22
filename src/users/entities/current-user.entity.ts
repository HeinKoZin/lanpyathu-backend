import { ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

@ObjectType()
export class CurrentUserEntity extends PickType(UserEntity, [
  'name',
  'id',
  'email',
  'photo',
]) {}
