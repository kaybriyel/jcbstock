import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonModal, IonSearchbar, ModalController, ModalOptions, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import Unit from 'src/app/models/unit';
import { ModelService } from 'src/app/services/model.service';
import { CreateUnitComponent } from '../create-unit/create-unit.component';

@Component({
  selector: 'app-select-units',
  templateUrl: './select-units.component.html',
  styleUrls: ['./select-units.component.scss'],
})
export class SelectUnitsComponent implements OnInit {
  @ViewChild('header', { read: ElementRef }) header: ElementRef;
  @ViewChild('addBtn', { read: ElementRef }) addBtn: ElementRef;
  @ViewChild('searchBar') searchBar: IonSearchbar;
  @ViewChild('content') content: IonContent;

  modal: IonModal
  htmlModal: any;
  subscriptions: Subscription[]

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform
  ) {}

  searchValue: string
  searchEnable: boolean = false
  list: Unit[]

  ngOnInit() {
    this.searchValue = ''
    this.list = []
    this.subscriptions = []

    this.subscriptions.push(this.platform.keyboardDidHide.subscribe(() => {
      console.log('keyboard hidden')
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
  }

  async loadData() {
    this.list = await Unit.load()
  }

  async presentModal(opt: ModalOptions) {
    if (this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create({...opt, canDismiss: false})
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  async openCreateUnitPage() {
    const { data } = await this.presentModal({ component: CreateUnitComponent })
    if (data) this.list.push(data)
  }

  openUpdateUnitPage(category: Unit) {

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

  back() {
    this.modal.canDismiss = true
    this.modal.dismiss()
  }

  select(unit: Unit) {
    this.modal.canDismiss = true
    this.modal.dismiss(unit)
  }

  get filteredUnits() {
    const smallNoSpace = t => t.toLowerCase().replace(/ /g, '')
    return this.list.filter(p => smallNoSpace(p.name).includes(smallNoSpace(this.searchValue)))
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }

  ngAfterViewChecked() {
    if (this.searchEnable) this.searchBar.setFocus()
  }

}
