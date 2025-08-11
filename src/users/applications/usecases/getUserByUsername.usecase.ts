import { Inject, Injectable } from '@nestjs/common';

import { IUser } from '../domains/user.domain';
import type { UserRepository } from '../ports/user.repository';
import { userRepositoryToken } from '../ports/user.repository';

export type GetUserByUsernameQuery = Pick<IUser, 'username'>;

@Injectable()
export class GetUserByUsernameUseCase {
  constructor(
    @Inject(userRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  execute(query: GetUserByUsernameQuery): Promise<IUser | undefined> {
    return this.userRepository.getByUsername(query.username);
  }
}
