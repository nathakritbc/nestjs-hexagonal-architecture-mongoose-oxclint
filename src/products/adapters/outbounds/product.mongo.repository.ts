import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Builder, StrictBuilder } from 'builder-pattern';
import { FilterQuery, Model } from 'mongoose';
import { IProduct, Product, ProductId } from 'src/products/applications/domains/product.domain';
import { getAllParams, IProductReturn, ProductRepository } from 'src/products/applications/ports/product.repository';
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

  private buildSearchFilter(search: string): FilterQuery<ProductEntity> {
    return {
      $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
    };
  }

  private mapProductsToDomain(products: ProductEntity[]): IProduct[] {
    return products.map(ProductMongoRepository.toDomain);
  }

  async getAll(params?: getAllParams): Promise<IProductReturn> {
    const { page = 1, limit = 10, search = '' } = params || {};

    const searchFilter = this.buildSearchFilter(search);
    const query = this.productModel.find(searchFilter).session(this.txHost.tx).lean();

    if (limit === -1) {
      const products = await query.exec();
      const result = StrictBuilder<IProductReturn>()
        .data(this.mapProductsToDomain(products))
        .total(products.length)
        .page(1)
        .limit(products.length)
        .totalPages(1)
        .build();
      return result;
    }

    const skip = (page - 1) * limit;
    const products = await query.skip(skip).limit(limit).exec();
    const totalPages = Math.ceil(products.length / limit);
    const total = await this.productModel.countDocuments(searchFilter).session(this.txHost.tx).lean().exec();
    const data = this.mapProductsToDomain(products);
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const result = StrictBuilder<IProductReturn>()
      .data(data)
      .total(total)
      .page(pageNumber)
      .limit(limitNumber)
      .totalPages(totalPages)
      .build();
    return result;
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
