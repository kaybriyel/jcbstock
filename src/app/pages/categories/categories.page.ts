import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, ModalController, ModalOptions, NavController, Platform } from '@ionic/angular';
import { CreateCategoryComponent } from 'src/app/modals/create-category/create-category.component';
import { UpdateCategoryComponent } from 'src/app/modals/update-category/update-category.component';
import Category from 'src/app/models/category';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
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

  async openCreateCategoryPage() {
    const {data} = await this.presentModal({ component: CreateCategoryComponent })
    if (data) this.list.push(data)
  }

  async openUpdateCategoryPage(category: Category) {
    await ModelService.saveSessionData('update-category-page', category)
    const {data} = await this.presentModal({ component: UpdateCategoryComponent })
    if (data) {
      const idx = this.list.findIndex(({id}) => data.id === id)
      this.list[idx] = data
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

  get filteredCategories() {
    const smallNoSpace = t => t ? t.toLowerCase().replace(/ /g, '') : t
    return this.list.filter(p => smallNoSpace(p.name).includes(smallNoSpace(this.searchValue)))
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }

  ngAfterViewChecked() {
    if (this.searchEnable) this.searchBar.setFocus()
  }

  async deleteCategory(id: number) {
    const deleted = await ModelService.delete({ name: Category.key, id })
    if (deleted) this.list.splice(this.list.findIndex(c => c.id === id), 1)
  }

}
