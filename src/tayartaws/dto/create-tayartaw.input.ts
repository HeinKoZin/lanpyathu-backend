import { InputType, OmitType } from '@nestjs/graphql';
import { TayartawEntity } from '../entities/tayartaw.entity';

@InputType()
export class CreateTayartawInput extends OmitType(
  TayartawEntity,
  ['id', 'createdAt', 'updatedAt'],
  InputType,
) {}
