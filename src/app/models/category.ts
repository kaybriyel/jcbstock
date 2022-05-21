import { ICategory, ICategoryLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import Product from "./product";

export default class Category implements ICategory, ICategoryLoader {
  id: number;
  name: string;
  item_count: number;
  img?: string;
  products?: Product[];
  type?: string = 'stock_category'

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

  async save() {
    let data
    if(isNaN(this.id)) {
      const { result } = await ModelService.create({ name: Category.key, object: this })
      if(result) data = result.data
    } else {
      const { result } = await ModelService.update({ name: Category.key, object: this })
      if(result) data = result.data
    }
    return data ? new Category(data) : null
  }

  static async load(): Promise<Category[]> {
    const { result } = await ModelService.getAPIData(Category.key)
    if(result) ModelService.saveLocalData(Category.key, result.data)
    return result ? result.data.map(c => new Category(c)) : []
  }

}