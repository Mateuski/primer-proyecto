import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// TODAS LAS VISTAS DEL MÓDULO PRODUCTO
import { ProductoComponent } from './pages/producto/producto.component';
import { JuegosComponent } from './pages/juegos/juegos.component';

const routes: Routes = [
  {
    path:"producto",component:ProductoComponent,

  },
  {
    path:"juegos",component:JuegosComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
