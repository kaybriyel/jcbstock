import { IProduct, IProductLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import category from "./category";
import ProductNotification from "../interfaces/product-notification";
import supplier from "./supplier";
import Unit from "./unit";
import Category from "./category";
import Supplier from "./supplier";

export default class Product implements IProduct, IProductLoader {
  id: number;
  name: string;
  qty: number;
  unit_id: number;
  category_id?: number;
  supplier_id?: number;
  img?: string;
  description?: string;
  notification?: ProductNotification;
  unit?: Unit;
  supplier?: supplier
  category?: category;

  static key: string = 'products';

  constructor(pro?: IProduct) {
    if (pro && typeof pro === 'object') {
      Object.keys(pro).forEach(k => this[k] = pro[k])
    }
    if(!this.img) this.img = '/assets/pics/product.png'
    if(!this.qty) this.qty = 0
    if(!(this.notification instanceof ProductNotification)) this.notification = new ProductNotification(this.notification)
  }
  timestamp: ITimestamp;
  setCategory(c: category) {
    this.category = c
    this.category_id = c ? c.id : undefined
  }
  setSupplier(s: supplier) {
    this.supplier = s
    this.supplier_id = s ? s.id : undefined
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
    return ModelService.find({ model: Category.key, search_value: this.category_id }).then(cat => {
      this.category = new Category(cat)
      return this.category
    })
  }

  get load_supplier(): Promise<Supplier> {
    return ModelService.find({ model: Supplier.key, search_value: this.supplier_id }).then(sup => {
      return this.supplier = new Supplier(sup)
    })
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
