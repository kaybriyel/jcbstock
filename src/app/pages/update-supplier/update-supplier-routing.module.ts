import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateSupplierPage } from './update-supplier.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateSupplierPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateSupplierPageRoutingModule {}
