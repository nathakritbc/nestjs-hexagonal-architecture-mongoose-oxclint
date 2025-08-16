import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { IOrder, OrderId } from '../domains/order.domain';
import { OrderRepository } from '../ports/order.repository';
import { DeleteOrderByIdUseCase } from './deleteOrderById.usecase';

describe('DeleteOrderByIdUseCase', () => {
  let deleteOrderByIdUseCase: DeleteOrderByIdUseCase;
  const orderRepository = mock<OrderRepository>();

  beforeEach(() => {
    deleteOrderByIdUseCase = new DeleteOrderByIdUseCase(orderRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const orderId = faker.string.uuid() as OrderId;
  it('should be throw error when order not found', async () => {
    //Arrange
    orderRepository.getById.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('Order not found');

    //Act
    const actual = deleteOrderByIdUseCase.execute(orderId);

    //Assert
    await expect(actual).rejects.toThrow(errorExpected);
    expect(orderRepository.getById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.deleteById).not.toHaveBeenCalled();
  });

  it('should be delete order', async () => {
    //Arrange
    const order = mock<IOrder>({ id: orderId });
    orderRepository.getById.mockResolvedValue(order);
    orderRepository.deleteById.mockResolvedValue(undefined);

    //Act
    const actual = await deleteOrderByIdUseCase.execute(orderId);
    //Assert
    expect(actual).toBeUndefined();
    expect(orderRepository.getById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.deleteById).toHaveBeenCalledWith(orderId);
  });
});
