import { Types } from 'mongoose';

import { OmitFunctions } from 'src/utils/function.util';
import { IProduct } from '../../applications/domains/product';

export interface ProductEntity extends OmitFunctions<Omit<IProduct, 'id'>> {
  _id?: Types.ObjectId;
}
