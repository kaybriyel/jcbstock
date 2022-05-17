import { ISupplier, ISupplierLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import CartItem from "./cart-item";
import cartItem from "./cart-item";
import OrderItem from "./order-item";
import Product from "./product";
import product from "./product";
import ProductSupplier from "./product-supplier";

export default class Supplier implements ISupplier, ISupplierLoader {
  id: number;
  name: string;
  img?: string;
  phone: string;
  product_count: number;
  products?: ProductSupplier[];
  timestamp: ITimestamp;
  static key: string = 'suppliers'

  constructor(sup?: ISupplier) {
    if (sup && typeof sup === 'object') {
      Object.keys(sup).forEach(k => this[k] = sup[k])
    }
  }
  cart_items?: cartItem[];

  get load_cart_items(): Promise<cartItem[]> {
    return load(this)
    async function load(sup: Supplier) {
      await sup.load_products
      for(const ps of sup.products) await ps.load_cart_item
      return sup.cart_items = sup.products.map(ps => ps.cart_item).filter(ps => ps)
    }
  }
  
  get is_valid(): boolean {
    return this.name && !isNaN(this.id)
  }

  get load_products(): Promise<ProductSupplier[]> {
    return load(this)
    async function load(sup: Supplier) {
      const pros = await ModelService.find({ model: ProductSupplier.key, search_key: 'supplier_id', search_value: sup.id, all: true })
      sup.product_count = pros.length
      return sup.products = pros.map(ps => new ProductSupplier(ps))
    }
  }

  static async createSupplier(sup: ISupplier): Promise<Supplier> {
    return new Supplier(await ModelService.create({ name: Supplier.key, object: sup }))
  }

  static async load(): Promise<Supplier[]> {
    const { result } = await ModelService.getLocalData(Supplier.key)
    return result ? result.map(c => new Supplier(c)) : []
  }

}