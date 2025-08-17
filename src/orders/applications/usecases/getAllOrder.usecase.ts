import { Inject, Injectable } from '@nestjs/common';
import type { getAllParams, IOrderReturn, OrderRepository } from '../ports/order.repository';
import { orderRepositoryToken } from '../ports/order.repository';

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject(orderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(params?: getAllParams): Promise<IOrderReturn> {
    return this.orderRepository.getAll(params);
  }
}
