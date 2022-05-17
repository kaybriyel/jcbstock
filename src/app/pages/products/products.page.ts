import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, ModalController, ModalOptions, NavController, Platform } from '@ionic/angular';
import { CreateProductComponent } from 'src/app/modals/create-product/create-product.component';
import { DetailProductComponent } from 'src/app/modals/detail-product/detail-product.component';
import { UpdateProductsComponent } from 'src/app/modals/update-products/update-products.component';
import Category from 'src/app/models/category';
import Product from 'src/app/models/product';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  @ViewChild('header', { read: ElementRef }) header: ElementRef;
  @ViewChild('addBtn', { read: ElementRef }) addBtn: ElementRef;
  @ViewChild('searchBar') searchBar: IonSearchbar;
  @ViewChild('content') content: IonContent;
  htmlModal: any;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    this.platform.keyboardDidHide.subscribe(() => this.addBtn.nativeElement.classList.remove('hide'))
    this.platform.keyboardDidShow.subscribe(() => this.addBtn.nativeElement.classList.add('hide'))
  }

  searchValue: string
  searchEnable: boolean = false
  list: Category[]
  category: Category

  ngOnInit() {
    this.searchValue = ''
    this.list = []
  }
  
  ionViewDidEnter() {
    this.loadData()
  }
  
  async loadData() {
    this.category = await Category.allCategory()
    this.list.push(this.category)
    this.list = this.list.concat(await Category.load())
    this.selectCategory(this.list[0])
  }

  async selectCategory(cat: Category) {
    if (!cat) return
    this.category = cat
    await this.category.load_products
    this.category.products.forEach(p => p.load_suppliers)
  }

  async presentModal(opt: ModalOptions) {
    if(this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create(opt)
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  async openCreateProductPage() {
    const {data} = await this.presentModal({ component: CreateProductComponent })
    if (data) {
      const list = await Category.load()
      list.forEach((c, i) => this.list[i+1] = c)
      this.selectCategory(data.category)
    }
  }

  async openUpdateProductPage(product: Product) {
    await ModelService.saveSessionData('update-product-page', product)
    const {data} = await this.presentModal({ component: UpdateProductsComponent })
    if (data) {
      const list = await Category.load()
      list.forEach((c, i) => this.list[i+1] = c)
      await data.load_category
      this.selectCategory(data.category)
    }
  }

  async openProductDetailPage(product: Product) {
    await ModelService.saveSessionData('product-detail-page', product)
    const {data} = await this.presentModal({ component: DetailProductComponent })
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
    const cat = this.list.find(c => c.name === e.detail.value)
    this.selectCategory(cat)
  }

  back() {
    this.navCtrl.back()
  }

  get filteredProducts() {
    const smallNoSpace = t => t.toLowerCase().replace(/ /g, '')
    return this.category.products.filter(p => smallNoSpace(p.name).includes(smallNoSpace(this.searchValue)))
  }

  async deleteProduct(id: number) {
    const deleted = await ModelService.delete({ name: Product.key, id })
    if (deleted)
      this.category.products.splice(this.category.products.findIndex(p => p.id === id), 1)
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }

  ngAfterViewChecked() {
    if (this.searchEnable) this.searchBar.setFocus()
  }

  scrollIntoView(e) {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  qtyColor(pro: Product) {
    if(pro.qty === 0) return 'danger'
    else if(pro.qty < pro.notification.trigger) return 'warning'
    return ''
  }

}
