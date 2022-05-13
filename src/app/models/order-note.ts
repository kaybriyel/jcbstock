import { IOrderNote, IOrderNoteLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import OrderItem from "./order-item";
import Supplier from "./supplier";
import supplier from "./supplier";

export default class OrderNote implements IOrderNote, IOrderNoteLoader {
  id: number;
  supplier_id: number;
  date: string;
  status: string;
  item_count: number;
  supplier?: Supplier;
  items?: OrderItem[];
  static key: string = 'order-notes'

  constructor(odn?: IOrderNote) {
    if(odn && typeof odn === 'object') {
      Object.keys(odn).forEach(k => this[k] = odn[k])
    }
  }
  timestamp: ITimestamp;
  get is_valid(): boolean {
    return !isNaN(this.id) && !isNaN(this.supplier_id) && !isNaN(this.item_count)
  }
  
  get load_supplier(): Promise<supplier> {
    return ModelService.find({ model: Supplier.key, search_value: this.supplier_id }).then(sup => {
      return this.supplier = new Supplier(sup)
    })
  }
  get load_items(): Promise<OrderItem[]> {
    return ModelService.find({ model: OrderItem.key, search_key: 'order_note_id', search_value: this.id, all: true }).then(items => {
      this.item_count = items.length
      return this.items = items.map(i => new OrderItem(i))
    })
  }

  static createOrderNote(odn: IOrderNote): OrderNote {
    return new OrderNote
  }

  static async load(): Promise<OrderNote[]> {
    const { result } = await ModelService.getLocalData(OrderNote.key)
    return result ? result.map(c => new OrderNote(c)) : []
  }
}