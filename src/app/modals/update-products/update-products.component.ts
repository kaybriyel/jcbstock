import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal, Platform, ModalController, ModalOptions } from '@ionic/angular';
import Category from 'src/app/models/category';
import Product from 'src/app/models/product';
import Supplier from 'src/app/models/supplier';
import Unit from 'src/app/models/unit';
import { ModelService } from 'src/app/services/model.service';
import { SelectCategoriesComponent } from '../select-categories/select-categories.component';
import { SelectSuppliersComponent } from '../select-suppliers/select-suppliers.component';
import { SelectUnitsComponent } from '../select-units/select-units.component';

@Component({
  selector: 'app-update-products',
  templateUrl: './update-products.component.html',
  styleUrls: ['./update-products.component.scss'],
})
export class UpdateProductsComponent implements OnInit {
  @ViewChild('updateProductBtn', { read: ElementRef }) updateProductBtn: ElementRef;

  product: Product
  prev: Product
  categories: Category[]
  modal: IonModal
  htmlModal: any;

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
  ) {
    this.platform.keyboardDidShow.subscribe(() => this.focus())
    this.platform.keyboardDidHide.subscribe(() => this.blur())
  }

  ngOnInit() {
    this.product = new Product
    this.product.supplier = new Supplier
    this.product.unit = Unit.default()
    this.loadData()
  }

  async loadData() {
    const { result } = await ModelService.getSessionData('update-product-page')
    this.product = new Product(result)
    this.product.load_supplier
    this.product.load_unit
    window['pro'] = this.product
    this.prev = JSON.parse(JSON.stringify(this.product))
  }

  scrollStart() { }

  scrolling(e) { }

  scrollEnd() { }

  focus() {
    this.updateProductBtn.nativeElement.classList.add('hide')
  }

  blur() {
    this.updateProductBtn.nativeElement.classList.remove('hide')
  }

  back() {
    this.modal.dismiss()
  }

  get productNotificationIcon() {
    return this.product.notification.is_enable ? 'notifications' : 'notifications-outline'
  }

  async presentModal(opt: ModalOptions) {
    if(this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create(opt)
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }
  
  async selectUnit() {
    const {data} = await this.presentModal({ component: SelectUnitsComponent })
    if (data) this.product.setUnit(data)
  }

  async selectSupplier() {
    const {data} = await this.presentModal({ component: SelectSuppliersComponent })

    if (data) this.product.setSupplier(data)
  }

  async updateProduct() {
    await ModelService.update({ name: Product.key, object: this.product })
    this.modal.dismiss(this.product)
  }

  async selectCategory() {
    const {data} = await this.presentModal({ component: SelectCategoriesComponent })
    if (data) this.product.setCategory(data)
  }

  url(url: string) {
    return `url(${url})`
  }

  get isModified() {
    return JSON.stringify(this.product) !== JSON.stringify(this.prev)
  }
}
