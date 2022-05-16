import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Platform, ModalController, IonModal, ModalOptions } from '@ionic/angular';
import Product from 'src/app/models/product';
import Unit from 'src/app/models/unit';
import { SelectCategoriesComponent } from '../select-categories/select-categories.component';
import { SelectUnitsComponent } from '../select-units/select-units.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  @ViewChild('createProductBtn', { read: ElementRef }) createProductBtn: ElementRef;

  product: Product
  modal: IonModal
  htmlModal: HTMLIonModalElement

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
  ) {
    this.platform.keyboardDidShow.subscribe(() => this.focus())
    this.platform.keyboardDidHide.subscribe(() => this.blur())
  }

  ngOnInit() {
    this.product = new Product
    this.product.setUnit(Unit.default())
  }

  scrollStart() { }

  scrolling(e) { }

  scrollEnd() { }

  focus() {
    this.createProductBtn.nativeElement.classList.add('hide')
  }

  blur() {
    this.createProductBtn.nativeElement.classList.remove('hide')
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
    const res = await this.htmlModal.onWillDismiss()
    await this.htmlModal.onDidDismiss()
    return res
  }

  async selectUnit() {
    const { data } = await this.presentModal({ component: SelectUnitsComponent })
    if (data) this.product.setUnit(data)
  }

  
  async selectCategory() {
    const {data} = await this.presentModal({ component: SelectCategoriesComponent })
    if (data) this.product.setCategory(data)
  }

  async createProduct() {
    this.product = await Product.createProduct(this.product)

    if (this.product.is_valid)
      this.modal.dismiss(this.product)
  }

  url(url: string) {
    return `url(${url})`
  }
  
  get isOk() {
    return (this.product.name && !isNaN(this.product.category_id))
  }


}

