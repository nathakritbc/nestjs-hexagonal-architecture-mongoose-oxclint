import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';
import { Model } from 'mongoose';

import { IUser, User, UserId } from '../../applications/domains/user.domain';
import { UserRepository } from '../../applications/ports/user.repository';
import { UserEntity } from './user.entity';
import { usersCollectionName } from './user.schema';

@Injectable()
export class UserMongoRepository implements UserRepository {
  constructor(
    @InjectModel(usersCollectionName)
    private readonly userModel: Model<UserEntity>,
  ) {}

  async create(user: IUser): Promise<IUser> {
    const newUser = new this.userModel(user);
    const userCreated = await newUser.save();
    return UserMongoRepository.toDomain(userCreated);
  }
  async getByUsername(username: string): Promise<IUser | undefined> {
    const user = await this.userModel.findOne({ username }).lean().exec();
    return user ? UserMongoRepository.toDomain(user) : undefined;
  }

  static toDomain(user: UserEntity): IUser {
    return Builder(User)
      .id(user._id!.toString() as UserId)
      .username(user.username)
      .email(user.email)
      .password(user.password)
      .createdAt(user.createdAt)
      .updateAt(user.updateAt)
      .build();
  }
}
