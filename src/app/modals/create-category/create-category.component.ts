import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController } from '@ionic/angular';
import Category from 'src/app/models/category';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  @ViewChild('createCategory', { read: ElementRef }) createCategoryBtn: ElementRef;

  modal: IonModal

  category: Category

  constructor() { }

  ngOnInit() {
    this.category = new Category
  }

  logScrollStart() { }

  logScrolling(e) { }

  logScrollEnd() { }

  back() {
    this.modal.canDismiss = true
    this.modal.dismiss()
  }

  async createCategory() {
    this.modal.canDismiss = true
    this.modal.dismiss(await this.category.save())
  }

  get isOk() {
    return this.category.name
  }
}
