import Category from "../models/category"
import OrderItem from "../models/order-item"
import OrderNote from "../models/order-note"
import Product from "../models/product"
import ProductNotification from "./product-notification"
import Supplier from "../models/supplier"
import Unit from "../models/unit"


export interface ITimestamp {
  created_at: Date
  updated_at: Date

  get format(): string
}

export interface ICategory {
  id: number
  name: string
  item_count: number
  img?: string
  timestamp: ITimestamp
  products?: Product[]
}

export interface ICategoryLoader {
  get load_products(): Promise<Product[]>
  get is_valid(): boolean
}

export interface IUnit {
  id: number
  name: string
  symbol: string
  conversions?: []
  timestamp?: ITimestamp
}

export interface IUnitLoader {
  get is_valid(): boolean
}

export interface IProduct {
  id: number
  name: string
  qty: number
  unit_id: number
  category_id?: number
  supplier_id?: number
  img?: string
  description?: string
  notification?: ProductNotification
  timestamp: ITimestamp
  unit?: Unit
  supplier?: Supplier
  category?: Category
}

export interface IProductLoader {
  get load_unit(): Promise<Unit>
  get load_category(): Promise<Category>
  get load_supplier(): Promise<Supplier>
  get is_valid(): boolean

  setUnit(u: Unit)
  setSupplier(s: Supplier)
  setCategory(c: Category)
}

export interface IOrderItem {
  id: number
  qty: number,
  supplier_id: number
  product_id: number
  order_note_id: number
  product?: Product
  supplier?: Supplier
  order_note?: OrderNote
  timestamp: ITimestamp
}

export interface IOrderItemLoader {
  get load_supplier(): Promise<Supplier>
  get load_product(): Promise<Product>
  get load_order_note(): Promise<OrderNote>
  get is_valid(): boolean
}

export interface IOrders {
  week_1: OrderNote[]
  week_2: OrderNote[]
  week_3: OrderNote[]
  week_4: OrderNote[]
  week_5: OrderNote[]
}

export interface IOrderNote {
  id: number
  supplier_id: number
  date: string,
  status: string,
  item_count: number
  supplier?: Supplier
  items?: OrderItem[]
  timestamp: ITimestamp
}

export interface IOrderNoteLoader {
  get load_supplier(): Promise<Supplier>
  get load_items(): Promise<OrderItem[]>
  get is_valid(): boolean
}

export interface ISupplier {
  id: number
  name: string
  img?: string
  phone: string
  product_count: number
  timestamp: ITimestamp
  products?: Product[]
}

export interface ISupplierLoader {
  get load_products(): Promise<Product[]>
  get is_valid(): boolean
}
