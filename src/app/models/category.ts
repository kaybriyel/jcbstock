import { ICategory, ICategoryLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import Product from "./product";

export default class Category implements ICategory, ICategoryLoader {
  id: number;
  name: string;
  item_count: number;
  img?: string;
  products?: Product[];

  static key: string = 'categories'

  constructor(cat?: ICategory) {
    if (cat && typeof cat === 'object') {
      Object.keys(cat).forEach(k => this[k] = cat[k])
    }
    if (!this.img) this.img = '/assets/pics/category.png'
    if (!this.products) this.products = []
  }

  timestamp: ITimestamp;
  
  get is_valid(): boolean {
    return this.name && !isNaN(this.id)
  }

  get load_products(): Promise<Product[]> {
    return load(this)

    async function load(cat: Category) {
      if (cat.name === 'ALL') {
        const { result } = await ModelService.getLocalData(Product.key)
        if (result) {
          cat.item_count = result.length
          return cat.products = result.map(r => new Product(r))
        }
      }
      else {
        const p = await ModelService.find({ model: Product.key, search_key: 'category_id', search_value: cat.id, all: true })
        cat.item_count = p.length
        return cat.products = p.map(p => new Product(p))
      }
    }
  }

  static async createCategory(cat: ICategory): Promise<Category> {
    return await ModelService.create({ name: Category.key, object: cat })
  }

  static async load(): Promise<Category[]> {
    const { result } = await ModelService.getLocalData(Category.key)
    return result ? result.map(c => new Category(c)) : []
  }

  print() {
    console.log(this)
  }

  static async allCategory() {
    const cat = new Category
    cat.name = 'ALL'
    const { result } = await ModelService.getLocalData(Product.key)
    if (result) cat.products = result.map(r => new Product(r))
    return cat
  }

}