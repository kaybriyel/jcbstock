import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import CartItem from 'src/app/models/cart-item';
import OrderNote from 'src/app/models/order-note';
import Supplier from 'src/app/models/supplier';
import { IOrders } from '../../interfaces/model-interfaces';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @ViewChild('header', { read: ElementRef }) header: ElementRef;
  @ViewChild('addBtn', { read: ElementRef }) addBtn: ElementRef;
  @ViewChild('searchBar') searchBar: IonSearchbar;
  @ViewChild('content') content: IonContent;
  subscriptions: Subscription[]

  constructor(private navCtrl: NavController, private platform: Platform) {}

  searchValue: string
  searchEnable: boolean = false
  list: IOrders
  weeks: string[]
  selectedWeek: string
  orderNotes: OrderNote[]

  ngOnInit() {
    this.searchValue = ''
    this.weeks = ['week_1', 'week_2', 'week_3', 'week_4', 'week_5']
    this.subscriptions = []
    this.subscriptions.push(this.platform.keyboardDidHide.subscribe(() => {
      console.log('keybaord hidden')
      this.addBtn.nativeElement.classList.remove('hide')
    }))
    this.subscriptions.push(this.platform.keyboardDidShow.subscribe(() => {
      console.log('keybaord shown')
      this.addBtn.nativeElement.classList.add('hide')
    }))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
  
  ionViewDidEnter() {
    this.loadData()
    this.orderNotes = []
  }

  async loadData() {
    this.list = {
      week_1: [],
      week_2: [],
      week_3: [],
      week_4: [],
      week_5: []
    }

    this.orderNotes = await OrderNote.load()
    this.orderNotes.forEach(async on => {
      on.load_supplier
      await on.load_items
      on.items.forEach(async i => {
        await i.load_product_supplier
        await i.product_supplier.load_product
        console.log(i)
      })
    })
    console.log(this.orderNotes)
    // for(const s of suppliers) await s.load_cart_items
    // this.suppliers = suppliers.filter(s => s.cart_items.length)
    this.selectWeek('week_1')
  }

  selectWeek(week: string) {
    this.selectedWeek = week
  }

  openCreateOrderPage() {
    this.navCtrl.navigateBack('/create-order')
  }

  scrollStart() {
    this.content.getScrollElement().then(se => {
      if ((se.scrollHeight - se.scrollTop) > screen.height) {
        this.header.nativeElement.classList.add('hide')
        this.addBtn.nativeElement.classList.add('hide')
      }
    })
  }
  scrolling(e) { }
  scrollEnd() {
    this.header.nativeElement.classList.remove('hide')
    this.addBtn.nativeElement.classList.remove('hide')
  }

  segmentChanged(e) {
    const smallNoSpace = t => t.toLowerCase().replace(/ /g, '')
    this.selectWeek(smallNoSpace(e.detail.value))
  }

  scrollIntoView(e) {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  back() {
    this.navCtrl.back()
  }

  get filteredOrders() {
    // return this.list[this.selectedWeek]
    return []
  }

  noUnderscore(s: string) {
    return s ? s.replace(/_/g, ' ') : ''
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }

  ngAfterViewChecked() {
    if (this.searchEnable) this.searchBar.setFocus()
  }

}

