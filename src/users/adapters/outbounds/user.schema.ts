import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import type {
  UserCreatedAt,
  UserEmail,
  UserPassword,
  UserUpdatedAt,
  UserUsername,
} from '../../applications/domains/user.domain';
import { UserEntity } from './user.entity';

export const usersCollectionName = 'users';

@Schema({
  collection: usersCollectionName,
  timestamps: true,
})
export class UserMongoSchema implements UserEntity {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  username: UserUsername;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: UserEmail;

  @Prop({
    type: String,
    required: true,
  })
  password: UserPassword;

  @Prop({
    type: Date,
    required: false,
  })
  createdAt?: UserCreatedAt;

  @Prop({
    type: Date,
    required: false,
  })
  updateAt?: UserUpdatedAt;
}
export const UserSchema = SchemaFactory.createForClass(UserMongoSchema);
UserSchema.index({ username: 1, email: 1 }, { unique: true });
