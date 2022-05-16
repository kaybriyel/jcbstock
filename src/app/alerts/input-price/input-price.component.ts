import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import Currency from 'src/app/models/currency';
import ProductSupplier from 'src/app/models/product-supplier';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-input-price',
  templateUrl: './input-price.component.html',
  styleUrls: ['./input-price.component.scss'],
})
export class InputPriceComponent implements OnInit {
  @ViewChild('okBtn', { read: ElementRef }) okBtn: ElementRef;

  modal:IonModal

  currencies: Currency[]
  productSupplier: ProductSupplier

  constructor() { }

  ngOnInit() {
    this.currencies = []
    this.productSupplier = new ProductSupplier
    this.productSupplier.currency_id = 0
    this.loadData()
  }

  async loadData() {
    this.currencies = await Currency.load()
    const { result } = await ModelService.getSessionData('input-price-page')
    if(result) {
      console.log(result)
      this.productSupplier = new ProductSupplier(result)
      this.productSupplier.load_supplier
      this.productSupplier.load_currency
    }
  }

  back() {
    this.modal.dismiss()
  }

  get isOk() {
    return this.productSupplier.unit_price && !isNaN(this.productSupplier.unit_price)
  }

  async ok() {
    if(this.productSupplier.id === undefined) {
      this.productSupplier = await ModelService.create({ name: ProductSupplier.key, object: this.productSupplier })
    } else {
      await ModelService.update({ name: ProductSupplier.key, object: this.productSupplier })
    }
    this.modal.dismiss(this.productSupplier)
  }

}
