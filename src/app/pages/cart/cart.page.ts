import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, IonSearchbar, ModalController, ModalOptions, NavController, Platform } from '@ionic/angular';
import { DetailProductComponent } from 'src/app/modals/detail-product/detail-product.component';
import CartItem from 'src/app/models/cart-item';
import Product from 'src/app/models/product';
import Supplier from 'src/app/models/supplier';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  @ViewChild('searchBar') searchBar: IonSearchbar;
  @ViewChild('content') content: IonContent;
  @ViewChild('header', { read: ElementRef }) header: ElementRef;
  @ViewChild('totalWrapper', { read: ElementRef }) totalWrapper: ElementRef;
  htmlModal: any;

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
    this.platform.keyboardDidHide.subscribe(() => this.totalWrapper.nativeElement.classList.remove('hide'))
    this.platform.keyboardDidShow.subscribe(() => this.totalWrapper.nativeElement.classList.add('hide'))
  }

  searchValue: string
  searchEnable: boolean = false
  suppliers: Supplier[]
  selectedSupplier: Supplier
  list: CartItem[]

  ngOnInit() {
    this.searchValue = ''
    this.suppliers = [];
    this.loadData()
  }

  async loadData() {
    const suppliers = await Supplier.load()
    for (const s of suppliers) await s.load_cart_items
    this.suppliers = suppliers.filter(s => s.cart_items.length)
    this.selectSupplier(this.suppliers[0])
  }

  async selectSupplier(sup: Supplier) {
    this.selectedSupplier = sup
    if (!sup) return
    this.list = this.selectedSupplier.cart_items
    for (const ci of this.list) {
      await ci.load_product
    }
  }

  scrollStart() {
    this.content.getScrollElement().then(se => {
      if ((se.scrollHeight - se.scrollTop) > screen.height) {
        this.header.nativeElement.classList.add('hide')
        this.totalWrapper.nativeElement.classList.add('hide')
      }
    })
  }
  scrolling(e) { }
  scrollEnd() {
    this.header.nativeElement.classList.remove('hide')
    this.totalWrapper.nativeElement.classList.remove('hide')
  }

  segmentChanged(e) {
    const sup = this.suppliers.find(s => s.name === e.detail.value)
    this.selectSupplier(sup)
  }

  scrollIntoView(e) {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }

  get filteredProducts() {
    const smallNoSpace = t => t.toLowerCase().replace(/ /g, '')
    return this.list.filter(ci => smallNoSpace(ci.product.name).includes(smallNoSpace(this.searchValue)))
  }

  noUnderscore(s: string) {
    return s ? s.replace(/_/g, ' ') : ''
  }

  ngAfterViewChecked() {
    if (this.searchEnable) this.searchBar.setFocus()
  }

  async presentModal(opt: ModalOptions) {
    if (this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create(opt)
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  async openProductDetailPage(product: Product) {
    if (!product) return
    await ModelService.saveSessionData('product-detail-page', product)
    await this.presentModal({ component: DetailProductComponent })
    const list = await this.selectedSupplier.load_cart_items
    list.forEach(async (ci, i) => {
      await ci.load_product
      this.list[i] = ci
    })
  }

  async delete(id: number) {
    const deleted = await ModelService.delete({ name: CartItem.key, id })
    if (deleted)
      this.list.splice(this.list.findIndex(c => c.id === id), 1)
  }

  async proceedOrder() {
    const odn = this.selectedSupplier.createOrderNote(this.selectedSupplier.cart_items)
    const ac = await this.alertCtrl.create({
      header: 'Proceed To Order',
      subHeader: `Your order will be sent to ${this.selectedSupplier.name}`,
      message: `Total: ${this.total}`,
      buttons: [
        {
          text: 'CANCEL'
        },
        {
          text: 'CONFIRM',
          handler: async () => {
            await odn.save()
            for (const c of this.selectedSupplier.cart_items)
              await ModelService.delete({ name: CartItem.key, id: c.id })
            this.list = []
            await this.loadData()
            if(!this.suppliers.length) {
              this.navCtrl.navigateBack('/orders')
            }
          }
        }
      ]
    })
    ac.present()
  }

  get total() {
    if (this.selectedSupplier && this.selectedSupplier.cart_items) {
      const currency = this.selectedSupplier.cart_items[0].product_supplier.currency.symbol
      const amounts = this.selectedSupplier.cart_items.map(c => c.amount)
      return `${currency} ${amounts.reduce((t, n) => t + n)}`
    }
  }
}
