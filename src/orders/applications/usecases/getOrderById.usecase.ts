import { Inject, Injectable } from '@nestjs/common';
import { IOrder, OrderId } from '../domains/order.domain';
import type { OrderRepository } from '../ports/order.repository';
import { orderRepositoryToken } from '../ports/order.repository';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(orderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(id: OrderId): Promise<IOrder | undefined> {
    return this.orderRepository.getById(id);
  }
}
