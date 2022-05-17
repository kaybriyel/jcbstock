import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController } from '@ionic/angular';
import Supplier from 'src/app/models/supplier';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-update-suppliers',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.scss'],
})
export class UpdateSupplierComponent implements OnInit {
  @ViewChild('updatesuppliers', { read: ElementRef }) updateSupplierBtn: ElementRef;

  prev: Supplier
  supplier: Supplier
  modal: IonModal

  constructor(
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this.supplier = new Supplier
    this.loadData()
  }

  async loadData() {
    const { result } = await ModelService.getLocalData('update-supplier-page')
    this.supplier = new Supplier(result)
    await this.supplier.load_products
    for(const ps of this.supplier.products) await ps.load_product
    this.prev = JSON.parse(JSON.stringify(this.supplier))
  }

  get isModified() {
    return JSON.stringify(this.supplier) !== JSON.stringify(this.prev)
  }

  async updateSupplier() {
    await ModelService.update({ name: Supplier.key, object: this.supplier })
    this.modal.dismiss(this.supplier)
  }

  scrollStart() { }

  scrolling(e: any) { }

  scrollEnd() { }

  back() {
    this.modal.dismiss()
  }

  url(url: string) {
    return `url(${url})`
  }
}
