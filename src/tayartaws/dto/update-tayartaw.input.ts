import { CreateTayartawInput } from './create-tayartaw.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTayartawInput extends PartialType(CreateTayartawInput) {
  @Field(() => String)
  id: string;
}
