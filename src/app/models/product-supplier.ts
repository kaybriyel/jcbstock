import { IProductSupplier as IProductSupplier, IProductSupplierLoader } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import CartItem from "./cart-item";
import Currency from "./currency";
import Product from "./product";
import Supplier from "./supplier";

export default class ProductSupplier implements IProductSupplier, IProductSupplierLoader {

  static key: string = 'product-suppliers'

  constructor(sup?: IProductSupplier) {
    if (sup && typeof sup === 'object') {
      Object.keys(sup).forEach(k => this[k] = sup[k])
    }
  }

  static async load(): Promise<ProductSupplier[]> {
    const { result } = await ModelService.getLocalData(ProductSupplier.key)
    return result ? result.map(c => new ProductSupplier(c)) : []
  }

  id: number;
  supplier_id: number;
  product_id: number;
  currency_id: number;
  unit_price: number;
  supplier?: Supplier;
  product?: Product;
  currency?: Currency;
  cart_item?: CartItem;

  get load_cart_item(): Promise<CartItem> {
    return load(this)
    async function load(sp: ProductSupplier) {
      const ci = await ModelService.find({ model: CartItem.key, search_value: sp.id })
      return ci ? sp.cart_item = new CartItem(ci) : null
    }
  }

  get formattedPrice(): string {
    if(!this.currency) this.load_currency
    return this.currency ? `${this.currency.symbol} ${ this.unit_price }` : `${this.unit_price}`
  }

  get load_supplier(): Promise<Supplier> {
    return load(this)
    async function load(sp: ProductSupplier) {
      const sup = await ModelService.find({ model: Supplier.key, search_value: sp.supplier_id })
      return sp.supplier = new Supplier(sup)
    }
  }

  get load_product(): Promise<Product> {
    return load(this)
    async function load(ps: ProductSupplier) {
      const pro = await ModelService.find({ model: Product.key, search_value: ps.product_id })
      return ps.product = new Product(pro)
    }
  }
  get load_currency(): Promise<Currency> {
    return load(this)
    async function load(sp: ProductSupplier) {
      const cur = await ModelService.find({ model: Currency.key, search_value: sp.currency_id })
      return sp.currency = new Currency(cur)
    }
  }
  setSupplier(s: Supplier) {
    throw new Error("Method not implemented.");
  }
  setProduct(p: Product) {
    throw new Error("Method not implemented.");
  }

  static async create(ps: IProductSupplier) {
    const { result } = await ModelService.create({ name: ProductSupplier.key, object: ps })
    if(result) return new ProductSupplier(result.data)
  }
}