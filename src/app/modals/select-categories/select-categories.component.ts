import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, IonContent, Platform, IonModal, ModalController, ModalOptions } from '@ionic/angular';
import Category from 'src/app/models/category';
import { CreateCategoryComponent } from '../create-category/create-category.component';

@Component({
  selector: 'app-select-categories',
  templateUrl: './select-categories.component.html',
  styleUrls: ['./select-categories.component.scss'],
})
export class SelectCategoriesComponent implements OnInit {
  @ViewChild('header', { read: ElementRef }) header: ElementRef;
  @ViewChild('addBtn', { read: ElementRef }) addBtn: ElementRef;
  @ViewChild('searchBar') searchBar: IonSearchbar;
  @ViewChild('content') content: IonContent;

  modal: IonModal
  htmlModal: HTMLIonModalElement;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform
    ) {
    this.platform.keyboardDidHide.subscribe(() => this.addBtn.nativeElement.classList.remove('hide'))
    this.platform.keyboardDidShow.subscribe(() => this.addBtn.nativeElement.classList.add('hide'))
  }

  searchValue: string
  searchEnable: boolean = false
  list: Category[]

  ngOnInit() {
    this.searchValue = ''
    this.list = []
  }

  ionViewDidEnter() {
    this.loadData()
  }
  
  async loadData() {
    this.list = await Category.load()
    this.list.forEach(i => i.load_products)
  }
  async presentModal(opt: ModalOptions) {
    if(this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create(opt)
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  async openCreateCategoryModal() {
    const {data} = await this.presentModal({ component: CreateCategoryComponent })
    if(data) this.modal.dismiss(data)
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

  select(c: Category) {
    this.modal.dismiss(c)
  }

  back() {
    this.modal.dismiss()
  }

  get filteredCategories() {
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
