import { Transactional } from '@nestjs-cls/transactional';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { Order, type IOrder, type OrderId } from 'src/orders/applications/domains/order.domain';
import type { getAllParams } from 'src/orders/applications/ports/order.repository';
import { CreateOrderUseCase } from 'src/orders/applications/usecases/createOrder.usecase';
import { DeleteOrderByIdUseCase } from 'src/orders/applications/usecases/deleteOrderById.usecase';
import { GetAllOrdersUseCase } from 'src/orders/applications/usecases/getAllOrder.usecase';
import { GetOrderByIdUseCase } from 'src/orders/applications/usecases/getOrderById.usecase';
import { UpdateOrderByIdUseCase } from 'src/orders/applications/usecases/updateOrderById.usecase';
import { CreateOrderDto } from './dto/createOrder.dto';
import type { UpdateOrderDto } from './dto/updateOrder.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly deleteOrderByIdUseCase: DeleteOrderByIdUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly updateOrderByIdUseCase: UpdateOrderByIdUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post()
  @Transactional()
  create(@Body() createOrderDto: CreateOrderDto): Promise<IOrder> {
    const command = Builder(Order)
      .date(createOrderDto.date)
      .status(createOrderDto.status)
      .customer(createOrderDto.customer)
      .build();
    return this.createOrderUseCase.execute(command);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The orders have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @Get()
  getAll(@Query() query: getAllParams): Promise<IOrder[]> {
    return this.getAllOrdersUseCase.execute(query);
  }

  @ApiOperation({ summary: 'Delete a order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The order not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @ApiParam({ name: 'id', type: String, description: 'The id of the order' })
  @Delete(':id')
  delete(@Param('id') id: OrderId): Promise<void> {
    return this.deleteOrderByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The order not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @ApiParam({ name: 'id', type: String, description: 'The id of the order' })
  @Put(':id')
  update(@Param('id') id: OrderId, @Body() updateOrderDto: UpdateOrderDto): Promise<IOrder> {
    const updateOrder = Builder(Order)
      .date(updateOrderDto.date!)
      .status(updateOrderDto.status!)
      .customer(updateOrderDto.customer!)
      .build();
    return this.updateOrderByIdUseCase.execute(id, updateOrder);
  }

  @ApiOperation({ summary: 'Get a order by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the order' })
  @Transactional()
  @Get(':id')
  getById(@Param('id') id: OrderId): Promise<IOrder | undefined> {
    return this.getOrderByIdUseCase.execute(id);
  }
}
