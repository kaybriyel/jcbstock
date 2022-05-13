import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import Unit from 'src/app/models/unit';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styleUrls: ['./create-unit.component.scss'],
})
export class CreateUnitComponent implements OnInit {
  @ViewChild('createUnit', { read: ElementRef }) createUnitBtn: ElementRef;

  modal: IonModal

  unit: Unit

  constructor() { }

  ngOnInit() {
    this.unit = new Unit
  }

  logScrollStart() { }

  logScrolling(e) { }

  logScrollEnd() { }

  back() {
    this.modal.dismiss()
  }

  async createUnit() {
    this.modal.dismiss(await Unit.createUnit(this.unit))
  }

  get isOk() {
    return this.unit.name
  }
}
