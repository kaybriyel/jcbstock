import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, ModalOptions, Platform } from '@ionic/angular';
import Product from 'src/app/models/product';
import Supplier from 'src/app/models/supplier';
import Unit from 'src/app/models/unit';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
})
export class DetailProductComponent implements OnInit {
  @ViewChild('addTocartWrapper', { read: ElementRef }) addTocartWrapper: ElementRef;

  modal: IonModal
  product: Product
  input_qty: number
  htmlModal: HTMLIonModalElement;
  constructor(private platform: Platform, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.platform.keyboardDidShow.subscribe(() => this.focus())
    this.platform.keyboardDidHide.subscribe(() => this.blur())
    this.product = new Product
    this.product.setUnit(Unit.default())
    this.loadData()
  }

  async loadData() {
    const { result } = await ModelService.getSessionData('product-detail-page')
    if (result) {
      this.product = new Product(result)
      this.product.load_suppliers
      this.product.load_unit
    }
  }

  scrollStart() { }

  scrolling(e) { }

  scrollEnd() { }

  focus() {
    this.addTocartWrapper.nativeElement.classList.add('hide')
  }

  async presentModal(opt: ModalOptions) {
    if (this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create(opt)
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  blur() {
    this.addTocartWrapper.nativeElement.classList.remove('hide')
  }

  back() {
    this.modal.dismiss()
  }

}
