import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, Platform } from '@ionic/angular';
import Product from 'src/app/models/product';

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

  constructor(private navCtrl: NavController, private platform: Platform) {
    this.platform.keyboardDidHide.subscribe(() => this.totalWrapper.nativeElement.classList.remove('hide'))
    this.platform.keyboardDidShow.subscribe(() => this.totalWrapper.nativeElement.classList.add('hide'))
  }

  searchValue: string
  searchEnable: boolean = false
  suppliers: string[]
  selectedSupplier: string
  list: Product[]

  ngOnInit() {
    this.searchValue = ''
    this.suppliers = [
      'Supplier_1', 'Supplier_2', 'Supplier_3', 'Supplier_4'
    ]

    this.selectSupplier('Supplier_1')
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
    const smallNoSpace = t => t.toLowerCase().replace(/ /g, '')
    this.selectSupplier(smallNoSpace(e.detail.value))
  }

  scrollIntoView(e) {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  selectSupplier(supplier: string) {
    this.selectedSupplier = supplier
    this.list = []
    const supplierId = this.suppliers.indexOf(supplier)
    for (let i = 0; i < 5; i++) {
      // this.list.push({ name: 'Product ' + i, qty: 5, unit: { symbol: 'KG', id: 1 }, supplier: { name: this.noUnderscore(supplier), id: supplierId } })
    }
  }

  back() {
    this.navCtrl.back()
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }

  get filteredProducts() {
    const smallNoSpace = t => t.toLowerCase().replace(/ /g, '')
    return this.list.filter(p => smallNoSpace(p.name).includes(smallNoSpace(this.searchValue)))
  }

  noUnderscore(s: string) {
    return s ? s.replace(/_/g, ' ') : ''
  }

  ngAfterViewChecked() {
    if (this.searchEnable) this.searchBar.setFocus()
  }

  openProductDetailPage() {
    this.navCtrl.navigateBack('/product-detail')
  }
}
