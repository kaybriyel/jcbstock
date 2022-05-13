import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateSupplierPageRoutingModule } from './update-supplier-routing.module';

import { UpdateSupplierPage } from './update-supplier.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateSupplierPageRoutingModule
  ],
  declarations: [UpdateSupplierPage]
})
export class UpdateSupplierPageModule {}
