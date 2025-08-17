import { IOrder, OrderId } from '../domains/order.domain';

export type CreateOrderCommand = Omit<IOrder, 'id' | 'createdAt' | 'updatedAt'>;

const orderRepositoryTokenSymbol: unique symbol = Symbol('OrderRepository');
export const orderRepositoryToken = orderRepositoryTokenSymbol.toString();

export interface IOrderReturn {
  data: IOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface getAllParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  customer?: string;
}

export interface OrderRepository {
  create(order: CreateOrderCommand): Promise<IOrder>;
  deleteById(id: OrderId): Promise<void>;
  getAll(params?: getAllParams): Promise<IOrderReturn>;
  getById(id: OrderId): Promise<IOrder | undefined>;
  updateById(id: OrderId, order: Partial<IOrder>): Promise<IOrder>;
}
