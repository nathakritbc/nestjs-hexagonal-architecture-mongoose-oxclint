import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Builder, StrictBuilder } from 'builder-pattern';
import { FilterQuery, Model } from 'mongoose';
import { IOrder, IOrderCustomer, Order, OrderId } from 'src/orders/applications/domains/order.domain';
import { getAllParams, IOrderReturn, OrderRepository } from 'src/orders/applications/ports/order.repository';
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

  private buildSearchFilter(search: string): FilterQuery<OrderEntity> {
    return {
      $or: [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
      ],
    };
  }

  private mapOrdersToDomain(orders: OrderEntity[]): IOrder[] {
    return orders.map(OrderMongoRepository.toDomain);
  }

  async getAll(params?: getAllParams): Promise<IOrderReturn> {
    const { page = 1, limit = 10, search = '' } = params || {};

    const searchFilter = this.buildSearchFilter(search);
    const query = this.orderModel.find(searchFilter).session(this.txHost.tx).lean();

    if (limit === -1) {
      const orders = await query.exec();
      const result = StrictBuilder<IOrderReturn>()
        .data(this.mapOrdersToDomain(orders))
        .total(orders.length)
        .page(1)
        .limit(orders.length)
        .totalPages(1)
        .build();
      return result;
    }

    const skip = (page - 1) * limit;
    const orders = await query.skip(skip).limit(limit).exec();
    const totalPages = Math.ceil(orders.length / limit);
    const total = await this.orderModel.countDocuments(searchFilter).session(this.txHost.tx).lean().exec();
    const data = this.mapOrdersToDomain(orders);
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const result = StrictBuilder<IOrderReturn>()
      .data(data)
      .total(total)
      .page(pageNumber)
      .limit(limitNumber)
      .totalPages(totalPages)
      .build();
    return result;
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
