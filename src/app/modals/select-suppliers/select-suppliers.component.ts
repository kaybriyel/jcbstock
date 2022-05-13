import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, IonContent, NavController, Platform, IonModal, ModalController, ModalOptions } from '@ionic/angular';
import Supplier from 'src/app/models/supplier';
import { ModelService } from 'src/app/services/model.service';
import { CreateSupplierComponent } from '../create-supplier/create-supplier.component';

@Component({
  selector: 'app-select-suppliers',
  templateUrl: './select-suppliers.component.html',
  styleUrls: ['./select-suppliers.component.scss'],
})
export class SelectSuppliersComponent implements OnInit {
  @ViewChild('header', { read: ElementRef }) header: ElementRef;
  @ViewChild('addBtn', { read: ElementRef }) addBtn: ElementRef;
  @ViewChild('searchBar') searchBar: IonSearchbar;
  @ViewChild('content') content: IonContent;

  modal: IonModal
  htmlModal: any;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    this.platform.keyboardDidHide.subscribe(() => this.addBtn.nativeElement.classList.remove('hide'))
    this.platform.keyboardDidShow.subscribe(() => this.addBtn.nativeElement.classList.add('hide'))
  }

  searchValue: string
  searchEnable: boolean = false
  list: Supplier[]

  ngOnInit() {
    this.searchValue = ''
    this.list = []
  }

  ionViewDidEnter() {
    this.loadData()
  }

  async loadData() {
    this.list = await Supplier.load()
    this.list.forEach(i => i.load_products)
  }

  async presentModal(opt: ModalOptions) {
    if(this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create(opt)
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  async openCreateSupplierModal() {
    const {data} = await this.presentModal({ component: CreateSupplierComponent })
    if (data) this.modal.dismiss(data)
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
    this.modal.dismiss()
  }

  select(s: Supplier) {
    this.modal.dismiss(s)
  }

  get filteredSuppliers() {
    const smallNoSpace = t => t.toLowerCase().replace(/ /g, '')
    return this.list.filter(p => smallNoSpace(p.name).includes(smallNoSpace(this.searchValue)))
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }

  ngAfterViewChecked() {
    if (this.searchEnable) this.searchBar.setFocus()
  }

  async deleteSupplier(id: number) {
    const deleted = await ModelService.delete({ name: Supplier.key, id })
    if (deleted) this.list.splice(this.list.findIndex(c => c.id === id), 1)
  }

}