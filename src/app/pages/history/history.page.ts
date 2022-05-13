import { Component, OnInit } from '@angular/core';
import Category from 'src/app/models/category';
import OrderItem from 'src/app/models/order-item';
import Product from 'src/app/models/product';
import Supplier from 'src/app/models/supplier';
import Unit from 'src/app/models/unit';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  searchValue:string
  menus: string[]
  searchEnable: boolean
  list: { id, name?, timestamp }[]
  constructor() { }

  ngOnInit() {
    this.searchValue = ''
    this.menus = [ 'orders', 'products', 'categories', 'suppliers', 'units' ]
  }

  scrollIntoView(e) {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  async segmentChanged(e) {
    const menu: string = e.detail.value
    console.log(menu)
    if(menu === 'products')
      this.list = await Product.load()
    else if(menu === 'categories') this.list = await Category.load()
    else if(menu === 'suppliers') this.list = await Supplier.load()
    else if(menu === 'units') this.list = await Unit.load()
    else if(menu === 'orders') this.list = await OrderItem.load()
    console.log(this.list)
  }

  get filtered() {
    const smallNoSpace = t => t ? t.toLowerCase().replace(/ /g, '') : t
    return this.list.filter(p => smallNoSpace(p.name).includes(smallNoSpace(this.searchValue)))
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }
}
