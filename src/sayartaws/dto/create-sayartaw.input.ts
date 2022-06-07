import { InputType, OmitType } from '@nestjs/graphql';
import { SayartawEntity } from '../entities/sayartaw.entity';

@InputType()
export class CreateSayartawInput extends OmitType(
  SayartawEntity,
  ['id', 'createdAt', 'updatedAt'],
  InputType,
) {}
