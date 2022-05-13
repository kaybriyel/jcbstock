import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, Platform } from '@ionic/angular';
import OrderNote from 'src/app/models/order-note';
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

  constructor(private navCtrl: NavController, private platform: Platform) {
    this.platform.keyboardDidHide.subscribe(() => this.addBtn.nativeElement.classList.remove('hide'))
    this.platform.keyboardDidShow.subscribe(() => this.addBtn.nativeElement.classList.add('hide'))
  }

  searchValue: string
  searchEnable: boolean = false
  list: IOrders
  weeks: string[]
  selectedWeek: string

  ngOnInit() {
    this.searchValue = ''
    this.weeks = ['week_1', 'week_2', 'week_3', 'week_4', 'week_5']
  }

  ionViewDidEnter() {
    this.loadData()
  }

  loadData() {
    this.list = {
      week_1: [],
      week_2: [],
      week_3: [],
      week_4: [],
      week_5: []
    }

    this.selectWeek('week_1')
  }

  selectWeek(week: string) {
    this.selectedWeek = week
    const orderNote: OrderNote[] = []
    this.list[week] = orderNote
    const weekDay = this.weeks.indexOf(week) * 7
    for (let i = 0; i < 3; i++) {
      const date = new Date
      date.setDate(date.getDate() + i + weekDay)
      // const orderItem:OrderItem = {
      //   qty: 0,
      //   supplier_id: 0,
      //   product_id: ''
      // }
      // orderNote.push()
    }
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
    return this.list[this.selectedWeek]
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

