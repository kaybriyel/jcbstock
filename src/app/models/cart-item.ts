import { ICartItem, ICartItemLoader } from "../interfaces/model-interfaces";
import { DetailProductComponent } from "../modals/detail-product/detail-product.component";
import { ModelService } from "../services/model.service";
import Product from "./product";
import ProductSupplier from "./product-supplier";

export default class CartItem implements ICartItem, ICartItemLoader {
  id: number;
  product_supplier_id: number;
  qty: number;
  product_supplier?: ProductSupplier;

  static key:string = 'cart-items'

  constructor(c?: ICartItem) {
    if(c && typeof c === 'object') {
      Object.keys(c).forEach(k => this[k] = c[k])
    }
  }
  get formattedAmount(): string {
    if(!this.product_supplier) this.load_product_supplier
    return `${this.product_supplier.currency.symbol} ${this.amount}`
  }
  product?: Product;
  get load_product(): Promise<Product> {
    return load(this)
    async function load(ci: CartItem) {
      await ci.load_product_supplier
      return ci.product = await ci.product_supplier.load_product
    }
  }

  get load_product_supplier(): Promise<ProductSupplier> {
    return load(this)
    async function load(ci: CartItem) {
      const sup = await ModelService.find({ model: ProductSupplier.key, search_value: ci.product_supplier_id })
      return ci.product_supplier = new ProductSupplier(sup)
    }
  }

  get amount(): number {
    return this.qty * this.product_supplier.unit_price
  }

}