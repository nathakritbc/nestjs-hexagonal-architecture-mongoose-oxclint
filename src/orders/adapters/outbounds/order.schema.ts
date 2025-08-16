import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import type { IOrderCustomer, OrderDate, OrderStatus } from '../../applications/domains/order.domain';
import { OrderEntity } from './order.entity';

export const ordersCollectionName = 'orders';

@Schema({
  collection: ordersCollectionName,
  timestamps: true,
})
export class OrderMongoSchema implements OrderEntity {
  @Prop({
    required: true,
    type: Date,
  })
  date: OrderDate;

  @Prop({
    required: true,
    type: String,
  })
  status: OrderStatus;

  @Prop({
    required: true,
    type: Object,
  })
  customer: IOrderCustomer;
}

export const OrderSchema = SchemaFactory.createForClass(OrderMongoSchema);
OrderSchema.index({ date: 1 }, { unique: false });
OrderSchema.index({ status: 1 }, { unique: false });
OrderSchema.index({ customer: 1 }, { unique: false });
