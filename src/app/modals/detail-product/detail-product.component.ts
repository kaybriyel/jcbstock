import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, ModalOptions, NavController, Platform } from '@ionic/angular';
import CartItem from 'src/app/models/cart-item';
import Product from 'src/app/models/product';
import ProductSupplier from 'src/app/models/product-supplier';
import Unit from 'src/app/models/unit';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
})
export class DetailProductComponent implements OnInit {
  @ViewChild('buttonWrapper', { read: ElementRef }) buttonWrapper: ElementRef;

  modal: IonModal
  product: Product
  input_qty: number
  cart_qty: number
  htmlModal: HTMLIonModalElement;
  productSupplier: ProductSupplier
  cartItem: CartItem

  constructor(
    private navCtrl: NavController, private modalCtrl: ModalController
    ) { }

  ngOnInit() {
    this.product = new Product
    this.product.setUnit(Unit.default())
    this.loadData()
  }

  async loadData() {
    const { result } = await ModelService.getSessionData('product-detail-page')
    if (result) {
      this.product = new Product(result)
      await this.product.load_suppliers
      this.cart_qty = await this.product.calc_cart_qty
      for(const ps of this.product.suppliers) {
        await ps.load_supplier
        await ps.load_cart_item
      }
      this.product.load_unit
    }
  }

  scrollStart() { }

  scrolling(e) { }

  scrollEnd() { }

  async presentModal(opt: ModalOptions) {
    if (this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create({...opt, canDismiss: false})

    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  blur() {
    this.buttonWrapper.nativeElement.classList.remove('hide')
  }

  back() {
    this.modal.canDismiss = true
    this.modal.dismiss()
  }

  async selectSupplier(ps: ProductSupplier) {
    if(!ps.cart_item) ps.cart_item = new CartItem({ id: undefined, qty:0, product_supplier_id: ps.id })
    this.productSupplier = ps
    this.cartItem = ps.cart_item
    this.cartItem.product_supplier_id = ps.id
  }

  async addToCart() {
    if(isNaN(this.cartItem.qty)) this.cartItem.qty = 0
    this.cartItem.qty += this.input_qty

    // save or update
    if(this.cartItem.id === undefined) await ModelService.create({ name: CartItem.key, object: this.cartItem })
    else await ModelService.update({ name: CartItem.key, object: this.cartItem })

    this.input_qty = undefined
    this.cart_qty = await this.product.calc_cart_qty
    for(const ps of this.product.suppliers) {
      await ps.load_supplier
      await ps.load_cart_item
    }
  }

  addOrRemove() {
    return this.input_qty > 0 ? 'added to' : 'deducted from'
  }

  successOrDanger(qty: number) {
    return qty > 0 ? 'success' : 'danger'
  }

  selectedSupplier(id:number) {
    if(this.productSupplier && this.productSupplier.id === id) return 'active'
  }

  abs(n: number) {
    return Math.abs(n)
  }

  viewCart() {
    this.modal.canDismiss = true
    this.modal.dismiss()
    this.navCtrl.navigateBack('/tabs/cart')
  }

  codeIcon(format: string) {
    const qr = 'qr-code-outline'
    const barcode = 'barcode-outline'
    return format === 'QR_CODE' ? qr : barcode
  }
}
