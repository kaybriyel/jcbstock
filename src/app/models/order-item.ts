import { IOrderItem, IOrderItemLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import OrderNote from "./order-note";
import orderNote from "./order-note";
import product from "./product";
import supplier from "./supplier";

export default class OrderItem implements IOrderItem, IOrderItemLoader {

  id: number;
  order_note_id: number;
  supplier_product_id: number;
  qty: number;
  unit_price: number;
  timestamp: ITimestamp;
  order_note?: OrderNote;
  
  static key: string = 'order-items'

  constructor(odi?: IOrderItem) {
    if (odi && typeof odi === 'object') {
      Object.keys(odi).forEach(k => this[k] = odi[k])
    }
  }
  
  get load_supplier(): Promise<supplier> {
    throw new Error("Method not implemented.");
  }
  get load_product(): Promise<product> {
    throw new Error("Method not implemented.");
  }
  get is_valid(): boolean {
    throw new Error("Method not implemented.");
  }
  

  get load_order_note(): Promise<orderNote> {
    return ModelService.find({ model: OrderNote.key, search_value: this.order_note_id })
  }

  static async load(): Promise<OrderItem[]> {
    const { result } = await ModelService.getLocalData(OrderItem.key)
    return result ? result.map(c => new OrderItem(c)) : []
  }

}