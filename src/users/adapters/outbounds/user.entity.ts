import { Types } from 'mongoose';

import { OmitFunctions } from 'src/utils/function.util';
import type { IUser } from '../../applications/domains/user.domain';

export interface UserEntity extends OmitFunctions<Omit<IUser, 'id'>> {
  _id?: Types.ObjectId;
}
