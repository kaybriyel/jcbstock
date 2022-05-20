import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { IonModal, Platform, ModalController, ModalOptions } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { InputPriceComponent } from 'src/app/alerts/input-price/input-price.component';
import Category from 'src/app/models/category';
import Product from 'src/app/models/product';
import ProductSupplier from 'src/app/models/product-supplier';
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
  subscriptions: Subscription[]

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private scanner: BarcodeScanner
  ) {}

  ngOnInit() {
    this.product = new Product
    this.product.unit = Unit.default()
    this.loadData()
    this.subscriptions = []
    this.subscriptions.push(this.platform.keyboardDidShow.subscribe(() => {
      console.log('keybaord shown')
      this.focus()
    }))
    this.subscriptions.push(this.platform.keyboardDidHide.subscribe(() => {
      console.log('keybaord hidden')
      this.blur()
    }))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  async loadData() {
    const { result } = await ModelService.getSessionData('update-product-page')
    this.product = new Product(result)
    await this.product.load_unit
    await this.product.load_suppliers
    for(const ps of this.product.suppliers) await ps.load_supplier
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
    this.modal.canDismiss = true
    this.modal.dismiss()
  }

  get productNotificationIcon() {
    return this.product.notification.is_enable ? 'notifications' : 'notifications-outline'
  }

  async presentModal(opt: ModalOptions) {
    if (this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create({...opt, canDismiss: false})
    this.htmlModal.present()
    const res = await this.htmlModal.onWillDismiss()
    await this.htmlModal.onDidDismiss()
    return res
  }

  async selectUnit() {
    const { data } = await this.presentModal({ component: SelectUnitsComponent })
    if (data) this.product.setUnit(data)
  }

  async updateProduct() {
    await ModelService.update({ name: Product.key, object: this.product })
    this.modal.canDismiss = true
    this.modal.dismiss(this.product)
  }

  async selectCategory() {
    const { data } = await this.presentModal({ component: SelectCategoriesComponent })
    if (data) this.product.setCategory(data)
  }

  async selectSupplier() {
    const { data: supplier } = await this.presentModal({ component: SelectSuppliersComponent })
    let ps = new ProductSupplier
    ps.supplier_id = supplier.id
    ps = await this.inputPrice(ps)
    if (ps) this.product.suppliers.push(ps)
  }

  async updatePrice(ps: ProductSupplier) {
    const data = await this.inputPrice(ps)
    if (data) {
      const fps = this.product.suppliers.find(({ id }) => id === ps.id)
      if (fps) {
        fps.currency_id = data.currency_id
        fps.unit_price = data.unit_price
        fps.load_currency
      }
    }
  }

  async inputPrice(ps: ProductSupplier) {
    if (ps) {
      ModelService.saveSessionData('input-price-page', { ...ps, product_id: this.product.id, currency_id: (ps.currency_id || 0) })
      const { data } = await this.presentModal({ component: InputPriceComponent })
      return data
    }
  }

  url(url: string) {
    return `url(${url})`
  }

  get isModified() {
    return JSON.stringify(this.product) !== JSON.stringify(this.prev)
  }

  codeIcon(format: string) {
    const qr = 'qr-code-outline'
    const barcode = 'barcode-outline'
    return format === 'QR_CODE' ? qr : barcode
  }

  async scanCode() {
    const {
      text,
      format,
      cancelled
    } = await this.scanner.scan()

    if(!cancelled) {
      this.product.code = text
      this.product.code_format = format
    }
  }
}
