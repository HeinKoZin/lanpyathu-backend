import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserEntity } from '@users/entities/current-user.entity';
import { UserEntity } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { LoginResponse } from './dto/login.response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserEntity): Promise<LoginResponse> {
    // const user = await this.usersService.findOneByEmail(loginUserInput.email);

    return {
      token: this.jwtService.sign({
        id: user.id,
      }),
      user,
    };
  }

  async me(currentUser: CurrentUserEntity): Promise<UserEntity> {
    return this.usersService.findOne(currentUser.id);
  }
}
