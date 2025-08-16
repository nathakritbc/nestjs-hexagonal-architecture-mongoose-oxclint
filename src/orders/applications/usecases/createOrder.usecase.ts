import { Inject, Injectable } from '@nestjs/common';
import { IOrder } from '../domains/order.domain';
import type { CreateOrderCommand, OrderRepository } from '../ports/order.repository';
import { orderRepositoryToken } from '../ports/order.repository';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(orderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(order: CreateOrderCommand): Promise<IOrder> {
    return this.orderRepository.create(order);
  }
}
