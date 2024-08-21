import { Product } from '../entities/product.entity';

export interface FindAllResponse {
  data: Array<Product>;
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
