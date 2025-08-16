import { Brand } from 'src/types/utility.type';

export enum OrderStatusEnum {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export type OrderId = Brand<string, 'OrderId'>;
export type OrderDate = Brand<Date, 'OrderDate'>;
export type OrderStatus = Brand<OrderStatusEnum, 'OrderStatus'>;

export type OrderCustomerInitial = Brand<string, 'OrderCustomerInitial'>;
export type OrderCustomerName = Brand<string, 'OrderCustomerName'>;
export type OrderCustomerEmail = Brand<string, 'OrderCustomerEmail'>;

export interface IOrderCustomer {
  initial: OrderCustomerInitial;
  name: OrderCustomerName;
  email: OrderCustomerEmail;
}

export interface IOrder {
  id: OrderId;
  date: OrderDate;
  status: OrderStatus;
  customer: IOrderCustomer;
}

export class Order implements IOrder {
  id: OrderId;
  date: OrderDate;
  status: OrderStatus;
  customer: IOrderCustomer;
}
