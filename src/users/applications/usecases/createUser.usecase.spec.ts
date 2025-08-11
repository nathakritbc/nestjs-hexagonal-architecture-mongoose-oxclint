import { faker } from '@faker-js/faker';
import { Builder, StrictBuilder } from 'builder-pattern';
import { mock } from 'vitest-mock-extended';

import { User, UserEmail, UserPassword, UserUsername } from '../domains/user.domain';
import { UserRepository } from '../ports/user.repository';
import { CreateUserCommand, CreateUserUseCase } from './createUser.usecase';

describe('Create User Use case', () => {
  it('should be create user.', async () => {
    // Arrange
    const username = faker.internet.username() as UserUsername;
    const password = faker.internet.password() as UserPassword;
    const email = faker.internet.email() as UserEmail;
    const expected = Builder(User).username(username).email(email).build();

    const userRepository = mock<UserRepository>();
    userRepository.create.mockResolvedValue(expected);
    const setHashPasswordSpy = vi.spyOn(User.prototype, 'setHashPassword').mockImplementation(async () => {});

    const createUserUseCase = new CreateUserUseCase(userRepository);
    const command = StrictBuilder<CreateUserCommand>().username(username).email(email).password(password).build();

    // Act
    const actual = await createUserUseCase.execute(command);

    // Assert
    expect(actual).toEqual(expected);
    expect(setHashPasswordSpy).toHaveBeenCalledWith(password);
    expect(userRepository.create).toHaveBeenCalledWith(expected);
  });
});
