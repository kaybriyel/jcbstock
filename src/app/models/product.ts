import { IProduct, IProductLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import ProductNotification from "../interfaces/product-notification";
import Unit from "./unit";
import Category from "./category";
import supplier from "./supplier";
import ProductSupplier from "./product-supplier";

export default class Product implements IProduct, IProductLoader {
  id: number;
  name: string;
  qty: number;
  unit_id: number;
  category_id: number;
  img?: string;
  description?: string;
  notification?: ProductNotification;
  category?: Category;
  unit?: Unit;
  timestamp: ITimestamp;
  suppliers?: ProductSupplier[];

  static key: string = 'products';

  constructor(pro?: IProduct) {
    if (pro && typeof pro === 'object') {
      Object.keys(pro).forEach(k => this[k] = pro[k])
    }
    if (!this.img) this.img = '/assets/pics/product.png'
    if (!this.qty) this.qty = 0
    if (!this.suppliers) this.suppliers = []
    if (!(this.notification instanceof ProductNotification)) this.notification = new ProductNotification(this.notification)
  }
  get load_suppliers(): Promise<ProductSupplier[]> {
    return load(this)
    async function load(pro: Product) {
      const ps = await ModelService.find({ model: ProductSupplier.key, search_value: pro.id, all: true })
      return pro.suppliers = ps.map(s => new ProductSupplier(s))
    }
  }
  setCategory(c: Category) {
    this.category = c
    this.category_id = c ? c.id : undefined
  }

  setUnit(u: Unit) {
    this.unit = u
    this.unit_id = u ? u.id : undefined
  }

  get load_unit(): Promise<Unit> {
    return ModelService.find({ model: Unit.key, search_value: this.unit_id }).then(u => {
      return this.unit = new Unit(u)
    })
  }

  get is_valid(): boolean {
    return this.name && !isNaN(this.id)
  }

  get load_category(): Promise<Category> {
    return load(this)
    async function load(pro: Product) {
      const cat = await ModelService.find({ model: Category.key, search_value: pro.category_id })
      pro.category = new Category(cat)
      return pro.category
    }
  }

  static async createProduct(pro: IProduct): Promise<Product> {
    return await ModelService.create({ name: Product.key, object: pro })
  }

  static async load(): Promise<Product[]> {
    const { result } = await ModelService.getLocalData(Product.key)
    return result ? result.map(c => new Product(c)) : []
  }

  print() {
    console.log(this)
  }
}
