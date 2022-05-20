import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Platform, ModalController, IonModal, ModalOptions } from '@ionic/angular';
import { Subscription } from 'rxjs';
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
  subscriptions: Subscription[]

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private scanner: BarcodeScanner
  ) { }

  ngOnInit() {
    this.product = new Product
    this.product.setUnit(Unit.default())
    this.subscriptions = []

    this.subscriptions.push(this.platform.keyboardDidHide.subscribe(() => {
      console.log('keyboard hidden')
      this.createProductBtn.nativeElement.classList.remove('hide')
    }))

    this.subscriptions.push(this.platform.keyboardDidShow.subscribe(() => {
      console.log('keyboard show')
      this.createProductBtn.nativeElement.classList.add('hide')
    }))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
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

  scrollStart() { }

  scrolling(e) { }

  scrollEnd() { }

  back() {
    this.modal.canDismiss = true
    this.modal.dismiss()
  }

  get productNotificationIcon() {
    return this.product.notification.is_enable ? 'notifications' : 'notifications-outline'
  }

  async presentModal(opt: ModalOptions) {
    if (this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create({ ...opt, canDismiss: false })
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
    const { data } = await this.presentModal({ component: SelectCategoriesComponent })
    if (data) this.product.setCategory(data)
  }

  async createProduct() {
    this.product = await Product.createProduct(this.product)

    if (this.product.is_valid) {
      this.modal.canDismiss = true
      this.modal.dismiss(this.product)
    }
  }

  url(url: string) {
    return `url(${url})`
  }

  get isOk() {
    return (this.product.name && !isNaN(this.product.category_id))
  }

  codeIcon(format: string) {
    const qr = 'qr-code-outline'
    const barcode = 'barcode-outline'
    return format === 'QR_CODE' ? qr : barcode
  }


}

