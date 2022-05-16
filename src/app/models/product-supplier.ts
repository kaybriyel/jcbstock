import { IProductSupplier as IProductSupplier, IProductSupplierLoader } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
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

  id: number;
  supplier_id: number;
  product_id: number;
  currency_id: number;
  unit_price: number;
  supplier?: Supplier;
  currency?: Currency;

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
    throw new Error("Method not implemented.");
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
}