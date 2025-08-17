import { Inject, Injectable } from '@nestjs/common';
import type { getAllParams, IProductReturn, ProductRepository } from '../ports/product.repository';
import { productRepositoryToken } from '../ports/product.repository';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject(productRepositoryToken)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(params?: getAllParams): Promise<IProductReturn> {
    return this.productRepository.getAll(params);
  }
}
