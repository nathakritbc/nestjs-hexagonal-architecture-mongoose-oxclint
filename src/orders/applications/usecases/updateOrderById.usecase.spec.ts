import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  IOrder,
  Order,
  OrderCustomerEmail,
  OrderCustomerInitial,
  OrderCustomerName,
  OrderDate,
  OrderId,
  OrderStatus,
  OrderStatusEnum,
} from '../domains/order.domain';
import { OrderRepository } from '../ports/order.repository';
import { UpdateOrderByIdUseCase } from './updateOrderById.usecase';

describe('UpdateOrderByIdUseCase', () => {
  let updateOrderByIdUseCase: UpdateOrderByIdUseCase;
  const orderRepository = mock<OrderRepository>();

  beforeEach(() => {
    updateOrderByIdUseCase = new UpdateOrderByIdUseCase(orderRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const orderId = faker.string.uuid() as OrderId;
  it('should be throw error when order not found', async () => {
    //Arrange
    orderRepository.getById.mockResolvedValue(undefined);
    const command = mock<IOrder>({ id: orderId });
    const errorExpected = new NotFoundException('Order not found');

    //Act
    const actual = updateOrderByIdUseCase.execute(orderId, command);

    //Assert
    await expect(actual).rejects.toThrow(errorExpected);
    expect(orderRepository.getById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.updateById).not.toHaveBeenCalled();
  });

  it('should be update order', async () => {
    //Arrange
    const resultOrderUpdate = mock<IOrder>({
      id: orderId,
      date: faker.date.recent() as OrderDate,
      status: faker.helpers.arrayElement(Object.values(OrderStatusEnum)) as OrderStatus,
      customer: {
        initial: faker.person.firstName().slice(0, 1) as OrderCustomerInitial,
        name: faker.person.fullName() as OrderCustomerName,
        email: faker.internet.email() as OrderCustomerEmail,
      },
    });
    orderRepository.getById.mockResolvedValue(resultOrderUpdate);
    orderRepository.updateById.mockResolvedValue(resultOrderUpdate);
    const command = Builder<Order>()
      .id(orderId)
      .date(resultOrderUpdate.date)
      .status(resultOrderUpdate.status)
      .customer(resultOrderUpdate.customer)
      .build();

    //Act
    const actual = await updateOrderByIdUseCase.execute(orderId, command);
    //Assert
    expect(actual).toEqual(resultOrderUpdate);
    expect(orderRepository.getById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.updateById).toHaveBeenCalledWith(orderId, command);
  });
});
