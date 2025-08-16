import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderId } from '../domains/order.domain';
import type { OrderRepository } from '../ports/order.repository';
import { orderRepositoryToken } from '../ports/order.repository';

@Injectable()
export class DeleteOrderByIdUseCase {
  constructor(
    @Inject(orderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(id: OrderId): Promise<void> {
    const orderFound = await this.orderRepository.getById(id);

    if (!orderFound) throw new NotFoundException('Order not found');
    return this.orderRepository.deleteById(id);
  }
}
