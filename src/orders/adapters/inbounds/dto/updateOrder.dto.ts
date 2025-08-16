import { IOrder } from 'src/orders/applications/domains/order.domain';

export interface UpdateOrderDto extends Partial<IOrder> {}
