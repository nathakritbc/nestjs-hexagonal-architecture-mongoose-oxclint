import { Types } from 'mongoose';

import { OmitFunctions } from 'src/utils/function.util';
import { IOrder } from '../../applications/domains/order.domain';

export interface OrderEntity extends OmitFunctions<Omit<IOrder, 'id'>> {
  _id?: Types.ObjectId;
}
