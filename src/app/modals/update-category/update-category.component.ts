import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import Category from 'src/app/models/category';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  @ViewChild('updateCategory', { read: ElementRef }) updateCategoryBtn: ElementRef;

  prev: Category
  category: Category
  modal: IonModal

  constructor() {
  }

  ngOnInit() {
    this.category = new Category
    this.loadData()
  }

  async loadData() {
    const { result } = await ModelService.getSessionData('update-category-page')
    if (result) {
      this.category = new Category(result)
      //this.category.load_products
      this.prev = JSON.parse(JSON.stringify(this.category))
    }
  }

  get isModified() {
    return JSON.stringify(this.category) !== JSON.stringify(this.prev)
  }

  async updateCategory() {
    await this.category.save()
    this.modal.canDismiss = true
    this.modal.dismiss(this.category)
  }

  logScrollStart() { }

  logScrolling(e: any) { }

  logScrollEnd() { }

  back() {
    this.modal.canDismiss = true
    this.modal.dismiss()
  }

  url(url: string) {
    return `url(${url})`
  }
}

