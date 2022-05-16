import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { InputPriceComponent } from './alerts/input-price/input-price.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PendingChangesGuard } from './guards/pending-changes.guard';
import { CreateCategoryComponent } from './modals/create-category/create-category.component';
import { CreateOrderNoteComponent } from './modals/create-order-note/create-order-note.component';
import { CreateProductComponent } from './modals/create-product/create-product.component';
import { CreateSupplierComponent } from './modals/create-supplier/create-supplier.component';
import { CreateUnitComponent } from './modals/create-unit/create-unit.component';
import { DetailProductComponent } from './modals/detail-product/detail-product.component';
import { SelectCategoriesComponent } from './modals/select-categories/select-categories.component';
import { SelectOrderNotesComponent } from './modals/select-order-notes/select-order-notes.component';
import { SelectProductsComponent } from './modals/select-products/select-products.component';
import { SelectSuppliersComponent } from './modals/select-suppliers/select-suppliers.component';
import { SelectUnitsComponent } from './modals/select-units/select-units.component';
import { UpdateCategoryComponent } from './modals/update-category/update-category.component';
import { UpdateOrderNotesComponent } from './modals/update-order-notes/update-order-notes.component';
import { UpdateProductsComponent } from './modals/update-products/update-products.component';
import { UpdateSupplierComponent } from './modals/update-supplier/update-supplier.component';
import { UpdateUnitsComponent } from './modals/update-units/update-units.component';

@NgModule({
  declarations: [
    AppComponent,
    

    CreateCategoryComponent,
    CreateProductComponent,
    CreateUnitComponent,
    CreateSupplierComponent,
    CreateOrderNoteComponent,

    DetailProductComponent,

    InputPriceComponent,

    SelectCategoriesComponent,
    SelectProductsComponent,
    SelectUnitsComponent,
    SelectSuppliersComponent,
    SelectOrderNotesComponent,

    UpdateCategoryComponent,
    UpdateProductsComponent,
    UpdateUnitsComponent,
    UpdateSupplierComponent,
    UpdateOrderNotesComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, OneSignal, PendingChangesGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
