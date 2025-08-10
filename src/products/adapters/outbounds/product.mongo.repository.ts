import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';
import { Model } from 'mongoose';
import { IProduct, Product, ProductId } from 'src/products/applications/domains/product';
import { ProductRepository } from 'src/products/applications/ports/product.repository';
import { ProductEntity } from './product.entity';
import { ProductMongoSchema, productsCollectionName } from './product.schema';

@Injectable()
export class ProductMongoRepository implements ProductRepository {
  constructor(
    @InjectModel(productsCollectionName)
    private readonly productModel: Model<ProductMongoSchema>,
    private readonly txHost: TransactionHost<TransactionalAdapterMongoose>,
  ) {}

  async create(body: IProduct): Promise<IProduct> {
    const newProduct = new this.productModel(body);
    const resultCreated = await newProduct.save({
      session: this.txHost.tx,
    });

    return ProductMongoRepository.toDomain(resultCreated);
  }

  async deleteById(id: ProductId): Promise<void> {
    await this.productModel.deleteOne({ _id: id }).session(this.txHost.tx).lean().exec();
  }

  async getAll(): Promise<IProduct[]> {
    const products = await this.productModel.find().session(this.txHost.tx).lean().exec();
    return products ? products.map(ProductMongoRepository.toDomain) : [];
  }

  async getById(id: ProductId): Promise<IProduct | undefined> {
    const product = await this.productModel.findById(id).session(this.txHost.tx).lean().exec();
    return product ? ProductMongoRepository.toDomain(product) : undefined;
  }

  async updateById(id: ProductId, product: Partial<IProduct>): Promise<IProduct> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, product, { new: true })
      .session(this.txHost.tx)
      .lean()
      .exec();
    return ProductMongoRepository.toDomain(updatedProduct!);
  }

  public static toDomain(productEntity: ProductEntity): IProduct {
    return Builder(Product)
      .id(productEntity._id!.toString() as ProductId)
      .name(productEntity.name)
      .price(productEntity.price)
      .description(productEntity.description)
      .image(productEntity.image)
      .createdAt(productEntity.createdAt)
      .updatedAt(productEntity.updatedAt)
      .build();
  }
}
