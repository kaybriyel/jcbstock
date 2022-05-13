import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import Supplier from 'src/app/models/supplier';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss'],
})
export class CreateSupplierComponent implements OnInit {
  @ViewChild('createSupplier', {read: ElementRef}) createSupplierBtn: ElementRef;
  
  supplier: Supplier
  modal: IonModal

  constructor() { }

  ngOnInit() {
    this.supplier = new Supplier
  }

  logScrollStart() { }

  logScrolling(e) { }

  logScrollEnd() { }

  back() {
    this.modal.dismiss()
  }

  async createSupplier() {
    this.modal.dismiss(await Supplier.createSupplier(this.supplier))
  }

  get isOk() {
    return this.supplier.name && this.supplier.phone
  }

}
