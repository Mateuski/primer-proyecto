import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';

// VISTAS DEL MÓDULO PRODUCTO
import { ProductoComponent } from './pages/producto/producto.component';
import { CardComponent } from './components/card/card.component';
import { CardJuegosComponent } from './components/card-juegos/card-juegos.component';
import { DlcComponent } from './pages/dlc/dlc.component';
import { JuegosComponent } from './pages/juegos/juegos.component';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { CarruselComponent } from './components/carrusel/carrusel.component';


@NgModule({
  declarations: [
    ProductoComponent,
    CardComponent,
    CardJuegosComponent,
    JuegosComponent,
    DlcComponent,
    SoporteComponent,
    CarruselComponent
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule
  ],
  exports: [
    ProductoComponent,
    CardJuegosComponent,
    CardComponent,
    JuegosComponent,
    DlcComponent,
    SoporteComponent
  ]
})
export class ProductoModule { }
