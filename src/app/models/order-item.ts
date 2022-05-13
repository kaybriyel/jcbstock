import { IOrderItem, IOrderItemLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import OrderNote from "./order-note";
import orderNote from "./order-note";
import Product from "./product";
import product from "./product";
import Supplier from "./supplier";
import supplier from "./supplier";

export default class OrderItem implements IOrderItem, IOrderItemLoader {
  id: number;
  order_note_id: number;
  qty: number;
  supplier_id: number;
  product_id: number;
  supplier?: Supplier;
  product?: Product;
  order_note?: OrderNote;
  static key: string = 'order-items'

  constructor(odi?: IOrderItem) {
    if (odi && typeof odi === 'object') {
      Object.keys(odi).forEach(k => this[k] = odi[k])
    }
  }
  timestamp: ITimestamp;
  get is_valid(): boolean {
    return !isNaN(this.qty) && !isNaN(this.id) && !isNaN(this.supplier_id) && !isNaN(this.product_id) && !isNaN(this.order_note_id)
  }

  get load_order_note(): Promise<orderNote> {
    return ModelService.find({ model: OrderNote.key, search_value: this.order_note_id })
  }

  get load_supplier(): Promise<supplier> {
    return ModelService.find({ model: Supplier.key, search_value: this.supplier_id }).then(sup => {
      return this.supplier = new Supplier(sup)
    })
  }

  get load_product(): Promise<product> {
    return ModelService.find({ model: Product.key, search_value: this.product_id }).then(pro => {
      return this.product = new Product(pro)
    })
  }

  static async load(): Promise<OrderItem[]> {
    const { result } = await ModelService.getLocalData(OrderItem.key)
    return result ? result.map(c => new OrderItem(c)) : []
  }

}