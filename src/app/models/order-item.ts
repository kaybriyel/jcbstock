import { IOrderItem, IOrderItemLoader, ITimestamp } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";
import CartItem from "./cart-item";
import OrderNote from "./order-note";
import ProductSupplier from "./product-supplier";

export default class OrderItem implements IOrderItem, IOrderItemLoader {
  async save() {
    let data
    if(isNaN(this.id)) {
      const { result } = await ModelService.create({ name: OrderItem.key, object: this })
      if(result) data = result.data
    } else {
      const { result } = await ModelService.update({ name: OrderItem.key, object: this })
      if(result) data = result.data
    }

    return data ? new OrderItem(data) : null
  }
  
  static fromCartItem(ci: CartItem): any {
    const oi:IOrderItem = {
      id: undefined,
      order_note_id: undefined,
      product_supplier_id: ci.product_supplier_id,
      qty: ci.qty,
      unit_price: ci.product_supplier.unit_price,
      timestamp: undefined,
    }
    return new OrderItem(oi)
  }

  id: number;
  order_note_id: number;
  product_supplier_id: number;
  qty: number;
  unit_price: number;
  timestamp: ITimestamp;
  order_note?: OrderNote;
  product_supplier?: ProductSupplier;
  
  static key: string = 'order-items'

  constructor(odi?: IOrderItem) {
    if (odi && typeof odi === 'object') {
      Object.keys(odi).forEach(k => this[k] = odi[k])
    }
  }
  
  get load_product_supplier(): Promise<ProductSupplier> {
    return load(this)
    async function load(oi: OrderItem) {
      const ps = await ModelService.find({ model: ProductSupplier.key, search_value: oi.product_supplier_id })
      if(ps) return oi.product_supplier = new ProductSupplier(ps)
    }
  }

  get is_valid(): boolean {
    throw new Error("Method not implemented.");
  }

  get load_order_note(): Promise<OrderNote> {
    return load(this)
    async function load(oi: OrderItem) {
      const odn = await ModelService.find({ model: OrderNote.key, search_value: oi.order_note_id })
      if(odn) return oi.order_note = new OrderNote(odn)
    }
  }

  static async load(): Promise<OrderItem[]> {
    const { result } = await ModelService.getLocalData(OrderItem.key)
    return result ? result.map(c => new OrderItem(c)) : []
  }

  get amount() {
    if(!this.product_supplier) this.load_product_supplier
    return this.product_supplier.unit_price * this.qty
  }

  get formattedAmount(): string {
    if(!this.product_supplier) this.load_product_supplier
    return `${this.product_supplier.currency.symbol} ${this.amount}`
  }

}