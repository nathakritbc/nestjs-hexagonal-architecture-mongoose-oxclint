import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';
import { Model } from 'mongoose';
import { IOrder, IOrderCustomer, Order, OrderId } from 'src/orders/applications/domains/order.domain';
import { OrderRepository } from 'src/orders/applications/ports/order.repository';
import { OrderEntity } from './order.entity';
import { OrderMongoSchema, ordersCollectionName } from './order.schema';

@Injectable()
export class OrderMongoRepository implements OrderRepository {
  constructor(
    @InjectModel(ordersCollectionName)
    private readonly orderModel: Model<OrderMongoSchema>,
    private readonly txHost: TransactionHost<TransactionalAdapterMongoose>,
  ) {}

  async create(body: IOrder): Promise<IOrder> {
    const newOrder = new this.orderModel(body);
    const resultCreated = await newOrder.save({
      session: this.txHost.tx,
    });

    return OrderMongoRepository.toDomain(resultCreated);
  }

  async deleteById(id: OrderId): Promise<void> {
    await this.orderModel.deleteOne({ _id: id }).session(this.txHost.tx).lean().exec();
  }

  async getAll(): Promise<IOrder[]> {
    const orders = await this.orderModel.find().session(this.txHost.tx).lean().exec();
    return orders ? orders.map(OrderMongoRepository.toDomain) : [];
  }

  async getById(id: OrderId): Promise<IOrder | undefined> {
    const order = await this.orderModel.findById(id).session(this.txHost.tx).lean().exec();
    return order ? OrderMongoRepository.toDomain(order) : undefined;
  }

  async updateById(id: OrderId, order: Partial<IOrder>): Promise<IOrder> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, order, { new: true })
      .session(this.txHost.tx)
      .lean()
      .exec();
    return OrderMongoRepository.toDomain(updatedOrder!);
  }

  public static buildICustomer(customerEntity: IOrderCustomer): IOrderCustomer {
    return Builder<IOrderCustomer>()
      .initial(customerEntity.initial)
      .name(customerEntity.name)
      .email(customerEntity.email)
      .build();
  }

  public static toDomain(orderEntity: OrderEntity): IOrder {
    const customer = OrderMongoRepository.buildICustomer(orderEntity.customer);

    return Builder(Order)
      .id(orderEntity._id!.toString() as OrderId)
      .date(orderEntity.date)
      .status(orderEntity.status)
      .customer(customer)
      .build();
  }
}
