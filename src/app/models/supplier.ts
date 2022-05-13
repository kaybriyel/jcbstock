import { ISupplier, ISupplierLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import OrderItem from "./order-item";
import Product from "./product";
import product from "./product";

export default class Supplier implements ISupplier, ISupplierLoader {
  id: number;
  name: string;
  img?: string;
  phone: string;
  product_count: number;
  products?: product[];
  static key: string = 'suppliers'

  constructor(sup?: ISupplier) {
    if (sup && typeof sup === 'object') {
      Object.keys(sup).forEach(k => this[k] = sup[k])
    }
  }
  timestamp: ITimestamp;
  get is_valid(): boolean {
    return this.name && !isNaN(this.id)
  }
  get load_products(): Promise<product[]> {
    const sup = this
    return getProducts()
    async function getProducts() {
      const odn = await ModelService.find({ model: OrderItem.key, search_key: 'supplier_id', search_value: sup.id, all: true })
      const pro = await ModelService.find({ model: Product.key, search_key: 'supplier_id', search_value: sup.id, all: true })

      const oId = odn.map(({ product_id }) => product_id)
      const pId = pro.map(({ id }) => id)
      
      const proIdSet = new Set([...oId, ...pId])

      const proId = [...proIdSet]
      sup.product_count = proId.length
      return sup.products = proId.map(id => new Product(pro.find(p => p.id === id)))
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