import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import type { UserEmail, UserPassword, UserUsername } from '../../applications/domains/user.domain';
import { UserEntity } from '../outbounds/user.entity';

export class CreateUserDto implements UserEntity {
  @IsString()
  @IsNotEmpty()
  username: UserUsername;

  @IsEmail()
  @IsNotEmpty()
  email: UserEmail;

  @IsString()
  @IsNotEmpty()
  password: UserPassword;
}
