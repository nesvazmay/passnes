import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccesoPageRoutingModule } from './acceso-routing.module';

import { AccesoPage } from './acceso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccesoPageRoutingModule
  ],
  declarations: [AccesoPage]
})
export class AccesoPageModule {}
