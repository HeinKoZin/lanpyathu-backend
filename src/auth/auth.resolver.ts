import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from '@auth/dto/login.input';
import { LoginResponse } from './dto/login.response';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '@decorators/current-user.decorator';
import { CurrentUserEntity } from '@users/entities/current-user.entity';
import { UserEntity } from '@users/entities/user.entity';

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

  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: CurrentUserEntity): Promise<UserEntity> {
    return this.authService.me(user);
  }
}
