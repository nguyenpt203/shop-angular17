import { IProduct } from './Product';

export interface ICart {
  id: number;
  productId: IProduct;
  quantity: number;
  product: IProduct;
}
