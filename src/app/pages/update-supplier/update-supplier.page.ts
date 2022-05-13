import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import Supplier from 'src/app/models/supplier';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.page.html',
  styleUrls: ['./update-supplier.page.scss'],
})
export class UpdateSupplierPage implements OnInit {
  @ViewChild('updatesuppliers', { read: ElementRef }) updateSupplierBtn: ElementRef;

  prev: Supplier
  supplier: Supplier

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
    console.log(this.supplier.products)
    this.prev = JSON.parse(JSON.stringify(this.supplier))
  }

  get isModified() {
    return JSON.stringify(this.supplier) !== JSON.stringify(this.prev)
  }

  async updateSupplier() {
    await ModelService.update({ name: Supplier.key, object: this.supplier })
  }

  scrollStart() { }

  scrolling(e: any) { }

  scrollEnd() { }

  back() {
    this.navCtrl.back()
  }

  url(url: string) {
    return `url(${url})`
  }
}
