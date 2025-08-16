import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './adapters/inbounds/order.controller';
import { OrderMongoRepository } from './adapters/outbounds/order.mongo.repository';
import { OrderSchema, ordersCollectionName } from './adapters/outbounds/order.schema';
import { orderRepositoryToken } from './applications/ports/order.repository';
import { CreateOrderUseCase } from './applications/usecases/createOrder.usecase';
import { DeleteOrderByIdUseCase } from './applications/usecases/deleteOrderById.usecase';
import { GetAllOrdersUseCase } from './applications/usecases/getAllOrder.usecase';
import { GetOrderByIdUseCase } from './applications/usecases/getOrderById.usecase';
import { UpdateOrderByIdUseCase } from './applications/usecases/updateOrderById.usecase';

@Module({
  imports: [MongooseModule.forFeature([{ name: ordersCollectionName, schema: OrderSchema }])],
  controllers: [OrderController],
  providers: [
    {
      provide: orderRepositoryToken,
      useClass: OrderMongoRepository,
    },
    CreateOrderUseCase,
    DeleteOrderByIdUseCase,
    GetAllOrdersUseCase,
    GetOrderByIdUseCase,
    UpdateOrderByIdUseCase,
  ],
})
export class OrderModule {}
