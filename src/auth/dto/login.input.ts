import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field({ nullable: false, description: 'User email' })
  email: string;

  @Field({ nullable: false, description: 'User password' })
  password: string;
}
