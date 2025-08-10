import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import type {
  ProductCreatedAt,
  ProductDescription,
  ProductImage,
  ProductName,
  ProductPrice,
  ProductUpdatedAt,
} from '../../applications/domains/product';
import { ProductEntity } from './product.entity';

export const productsCollectionName = 'products';

@Schema({
  collection: productsCollectionName,
  timestamps: true,
})
export class ProductMongoSchema implements ProductEntity {
  @Prop({
    required: true,
  })
  name: ProductName;

  @Prop({
    required: true,
  })
  price: ProductPrice;

  @Prop({
    required: true,
  })
  description: ProductDescription;

  @Prop({
    required: true,
  })
  image: ProductImage;

  @Prop({
    type: Date,
    required: false,
  })
  createdAt?: ProductCreatedAt;

  @Prop({
    type: Date,
    required: false,
  })
  updatedAt?: ProductUpdatedAt;
}

export const ProductSchema = SchemaFactory.createForClass(ProductMongoSchema);
ProductSchema.index({ name: 1 }, { unique: false });
ProductSchema.index({ price: 1 }, { unique: false });
