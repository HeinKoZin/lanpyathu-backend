import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from '@auth/dto/login.input';
import { LoginResponse } from './dto/login.response';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ): Promise<LoginResponse> {
    return this.authService.login(context.user);
  }
}
