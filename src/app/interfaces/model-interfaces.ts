import Category from "../models/category"
import OrderItem from "../models/order-item"
import OrderNote from "../models/order-note"
import Product from "../models/product"
import ProductNotification from "./product-notification"
import Supplier from "../models/supplier"
import Unit from "../models/unit"
import Currency from "../models/currency"
import ProductSupplier from "../models/product-supplier"


export interface ITimestamp {
  created_at: Date
  updated_at: Date

  get format(): string
}

export interface ICategory {
  id: number
  name: string
  img?: string
  timestamp: ITimestamp
}

export interface ICategoryLoader {
  item_count: number
  products?: Product[]
  get load_products(): Promise<Product[]>
  get is_valid(): boolean
}

export interface IUnit {
  id: number
  name: string
  symbol: string
  timestamp?: ITimestamp
}

export interface IUnitLoader {
  conversions?: []
  get is_valid(): boolean
}

export interface IProduct {
  id: number
  name: string
  qty: number
  unit_id: number
  category_id: number
  img?: string
  description?: string
  notification?: ProductNotification
  timestamp: ITimestamp
}

export interface IProductLoader {
  category?: Category
  unit?: Unit
  suppliers?: ProductSupplier[]
  get load_unit(): Promise<Unit>
  get load_suppliers(): Promise<ProductSupplier[]>
  get load_category(): Promise<Category>
  get is_valid(): boolean
  
  setUnit(u: Unit)
  setCategory(c: Category)
}

export interface IOrderItem {
  id: number
  order_note_id: number
  supplier_product_id: number
  qty: number,
  unit_price: number
  timestamp: ITimestamp
}

export interface IOrderItemLoader {
  order_note?: OrderNote
  get load_supplier(): Promise<Supplier>
  get load_product(): Promise<Product>
  get load_order_note(): Promise<OrderNote>
  get is_valid(): boolean
}

export interface IProductSupplier {
  id: number
  supplier_id: number
  product_id: number
  currency_id: number
  unit_price: number
}

export interface IProductSupplierLoader {
  supplier?: Supplier
  currency?: Currency
  get load_supplier(): Promise<Supplier>
  get load_product(): Promise<Product>
  get load_currency(): Promise<Currency>
  get formattedPrice(): string

  setSupplier(s: Supplier)
  setProduct(p: Product)
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
  timestamp: ITimestamp
}

export interface IOrderNoteLoader {
  supplier?: Supplier
  items?: OrderItem[]
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
}

export interface ISupplierLoader {
  products?: Product[]
  get load_products(): Promise<Product[]>
  get is_valid(): boolean
}


export interface ICurrency {
  id: number
  code: string
  symbol: string
  name: string
}

export interface ICurrencyLoader {
  conversions?: []
}