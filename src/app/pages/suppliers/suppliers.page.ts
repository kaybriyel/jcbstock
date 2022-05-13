import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, ModalController, ModalOptions, NavController, Platform } from '@ionic/angular';
import { CreateSupplierComponent } from 'src/app/modals/create-supplier/create-supplier.component';
import { UpdateSupplierComponent } from 'src/app/modals/update-supplier/update-supplier.component';
import Supplier from 'src/app/models/supplier';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.page.html',
  styleUrls: ['./suppliers.page.scss'],
})
export class SuppliersPage implements OnInit {
  @ViewChild('header', { read: ElementRef }) header: ElementRef;
  @ViewChild('addBtn', { read: ElementRef }) addBtn: ElementRef;
  @ViewChild('searchBar') searchBar: IonSearchbar;
  @ViewChild('content') content: IonContent;
  htmlModal: any;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private modalCtrl: ModalController
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

  async openCreateSupplierPage() {
    const {data} = await this.presentModal({ component: CreateSupplierComponent })
    if (data) this.list.push(data)
  }

  async openUpdateSupplierPage(sup: Supplier) {
    await ModelService.saveLocalData('update-supplier-page', sup)
    const {data} = await this.presentModal({ component: UpdateSupplierComponent })
    if(data) {
      const id = this.list.findIndex(({ id }) => id === sup.id)
      this.list[id] = data
    }
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
    this.navCtrl.back()
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