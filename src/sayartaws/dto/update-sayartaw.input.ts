import { CreateSayartawInput } from './create-sayartaw.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSayartawInput extends PartialType(CreateSayartawInput) {
  @Field(() => String)
  id: string;
}
