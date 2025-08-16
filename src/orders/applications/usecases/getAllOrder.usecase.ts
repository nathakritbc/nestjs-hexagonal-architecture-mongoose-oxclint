import { Inject, Injectable } from '@nestjs/common';
import { IOrder } from '../domains/order.domain';
import type { OrderRepository } from '../ports/order.repository';
import { orderRepositoryToken } from '../ports/order.repository';

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject(orderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(): Promise<IOrder[]> {
    return this.orderRepository.getAll();
  }
}
