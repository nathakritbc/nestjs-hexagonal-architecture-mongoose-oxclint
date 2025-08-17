import { IProduct, ProductId } from '../domains/product.domain';

export type CreateProductCommand = Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>;

const productRepositoryTokenSymbol: unique symbol = Symbol('ProductRepository');
export const productRepositoryToken = productRepositoryTokenSymbol.toString();

export interface IProductReturn {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface getAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductRepository {
  create(product: CreateProductCommand): Promise<IProduct>;
  deleteById(id: ProductId): Promise<void>;
  getAll(params?: getAllParams): Promise<IProductReturn>;
  getById(id: ProductId): Promise<IProduct | undefined>;
  updateById(id: ProductId, product: Partial<IProduct>): Promise<IProduct>;
}
