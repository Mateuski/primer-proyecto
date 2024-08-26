import { Component } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { CrudService } from 'src/app/modules/admin/services/crud.service';

@Component({
  selector: 'app-card-juegos',
  templateUrl: './card-juegos.component.html',
  styleUrls: ['./card-juegos.component.css']
})
export class CardJuegosComponent {

  // Colleccion de todos los productos de forma local
  coleccionProductos: Producto[] = []

  // Coleccion de productos de una sola categoria
  coleccionJuegos: Producto[] = []

  // Variable para seleccionar productos especificos
  productoSeleccionado!: Producto;

  // Variable para manejar estado del modal
  modalVisible: boolean = false;

  // Patentamos de forma local el servicio para acceder en el
  constructor(public servicioCrud: CrudService){}

  // Inicializa al momento que renderiza el componente
  ngOnInit(): void{
    // Accedemos a metodo 'obtenerProducto' y nos suscribimos a los cambios
    // recibimos notificacion ante modificaciones
    this.servicioCrud.obtenerProducto().subscribe(producto => {

    // Mostrara la coleccion de esa categoria hasta el momento
    this.coleccionProductos = producto;
    })
  }

  // Funcion para filtrar los productos de tipo "juegos"
  mostrarProductosJuegos(){
    this.coleccionJuegos.forEach(Producto => {
      // Si es de un tipo de "juego" -> condicional
      if(Producto.categoria === "Juegos"){

      // Lo sube/ guarda en la coleccion de productos de tipo "juegos"  
      this.coleccionJuegos.push(Producto)
      }
    })
  }
  
   mostrarVer(info: Producto){
    this.modalVisible = true;

    this.productoSeleccionado = info;
 }
}