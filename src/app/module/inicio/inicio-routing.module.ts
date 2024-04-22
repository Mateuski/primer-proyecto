import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from 'src/app/inicio/inicio.component';

// RUTAS HIJAS DEL MODULO INICIO
const routes: Routes = [
  //ruta inicial / principal
  {path:"", component: InicioComponent},

  // Carga perezosa -> ruta al modulo inicio
  {path:"Inicio",component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
