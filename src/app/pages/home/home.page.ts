import { Component, OnInit } from '@angular/core';
import { ModalController, ModalOptions, NavController } from '@ionic/angular';
import { CreateCategoryComponent } from 'src/app/modals/create-category/create-category.component';
import { CreateProductComponent } from 'src/app/modals/create-product/create-product.component';
import { SelectUnitsComponent } from 'src/app/modals/select-units/select-units.component';
import Category from 'src/app/models/category';
import OrderNote from 'src/app/models/order-note';
import Product from 'src/app/models/product';
import Supplier from 'src/app/models/supplier';

interface Data {
  category_count: number
  product_count: number
  supplier_count: number
  order_note_count: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  data: Data
  htmlModal: any;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.data = {
      category_count: 0,
      product_count: 0,
      supplier_count: 0,
      order_note_count: 0
    }
  }

  ionViewDidEnter() {
    this.loadData()
  }

  async loadData() {
    const categories = await Category.load()
    const products = await Product.load()
    const suppliers = await Supplier.load()
    const order_notes = await OrderNote.load()
    this.data.category_count = categories.length
    this.data.product_count = products.length
    this.data.supplier_count = suppliers.length
    this.data.order_note_count = order_notes.length

  }

  async presentModal(opt: ModalOptions) {
    if(this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create({...opt, canDismiss: false})
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  async openCreateProductPage() {
    const {data} = await this.presentModal({ component: CreateProductComponent })
    if(data) this.navCtrl.navigateBack('/products')
  }

  openProductsPage() {
    this.navCtrl.navigateBack('/products')
  }

  async openCreateCategoryPage() {
    const {data} = await this.presentModal({ component: CreateCategoryComponent })
    if(data) this.navCtrl.navigateBack('/categories')
  }

  async openCategoriesPage() {
    this.navCtrl.navigateBack('/categories')
  }

  openCreateOrderPage() {
    this.navCtrl.navigateBack('/create-order')
  }

  openSuppliersPage() {
    this.navCtrl.navigateBack('/suppliers')
  }

  openCartPage() {
    this.navCtrl.navigateBack('/orders')
  }

}
