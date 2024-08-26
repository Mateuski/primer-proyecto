import { Component } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { CrudService } from 'src/app/modules/admin/services/crud.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
// Definimos coleccion de productos locales
  coleccionProductos: Producto[] = [];

// Variable local para manejar estado de un modal
  productoSeleccionado!: Producto;

// Variable local para manejar estado de un modal
  modalVisible: boolean = false;

constructor(public servicioCrud: CrudService){}

ngOnInit(): void{
  this.servicioCrud.obtenerProducto().subscribe(producto => {
    this.coleccionProductos = producto;
  })
}

// Funcion para mostrar mas informacion de los productos
  mostrarVer(Info: Producto){

// Cambio estado del modal a true (ahora es visible)
  this.modalVisible = true;

// Guardo en variable seleccionado la informacion de producto elegido
  this.productoSeleccionado = Info

}
}