import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import type { IOrderCustomer, OrderDate, OrderStatus } from 'src/orders/applications/domains/order.domain';
import { CreateOrderCommand } from 'src/orders/applications/ports/order.repository';

export class CreateOrderDto implements CreateOrderCommand {
  @ApiProperty({
    type: String,
    example: '2021-01-01',
    description: 'The date of the order',
  })
  @IsNotEmpty()
  date: OrderDate;

  @ApiProperty({
    type: String,
    example: 'Pending',
    description: 'The status of the order',
  })
  @IsNotEmpty()
  status: OrderStatus;

  @ApiProperty({
    type: Object,
    example: {
      initial: 'J',
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  })
  @IsNotEmpty()
  customer: IOrderCustomer;
}
