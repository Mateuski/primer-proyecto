import { Component } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { CrudService } from '../../services/crud.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  // Creamos colección local de productos -> la definimos como array
  coleccionProductos: Producto[] = [];

  modalVisibleproducto: boolean=false
  productoSeleccionado!: Producto

  // Definimos formulario para los productos
  /**
   * Atributos alfanuméricos (string) se inicializan con comillas simples
   * Atributos numéricos (number) se inicializan con cero ('0')
   */
  producto = new FormGroup({
    nombre: new FormControl('', Validators.required),
    precio: new FormControl(0, Validators.required),
    descripcion: new FormControl('', Validators.required),
    categoria: new FormControl('', Validators.required),
    imagen: new FormControl('', Validators.required),
    alt: new FormControl('', Validators.required)
  })

  constructor(public servicioCrud: CrudService) { }

  ngOnInit(): void {
    this.servicioCrud.obtenerProducto().subscribe(producto => {
      this.coleccionProductos = producto;
    })
  }

  async agregarProducto() {
    if (this.producto.valid) {
      let nuevoProducto: Producto = {
        idProducto: '',
        nombre: this.producto.value.nombre!,
        precio: this.producto.value.precio!,
        descripcion: this.producto.value.descripcion!,
        categoria: this.producto.value.categoria!,
        imagen: this.producto.value.imagen!,
        alt: this.producto.value.alt!
      }

      await this.servicioCrud.crearProducto(nuevoProducto)
        .then(producto => {
          alert("Ha agregado un nuevo producto con éxito.");
        })
        .catch(error => {
          alert("Ha ocurrido un error al cargar un producto.");
        })
    }
  }

  //funcion vinculada al modal y el boton de la tabla
mostrarBorrar(productoSeleccionado: Producto){
  this.modalVisibleproducto = true;

  this.productoSeleccionado = productoSeleccionado;
}

borrarProducto (){
  this.servicioCrud.eliminarproducto(this.productoSeleccionado.idProducto)
  .then(respuesta => {
    alert("se ha podido eliminar con exito");
  })
  .catch(error => {
    alert("Ha ocurrido un error al eliminar un producto: \n"+error)
  })
}

//EDITAR PRODUCTO
mostrarEditar(productoSeleccionado: Producto){
  this.productoSeleccionado = productoSeleccionado
  /*
  *Tomo los valores del producto seleccionado y los va a
  *autocompletar en el formulario del modal (menos el ID)
  */
  this.producto.setValue({
    nombre: productoSeleccionado.nombre,
    precio: productoSeleccionado.precio,
    descripcion: productoSeleccionado.descripcion,
    categoria: productoSeleccionado.categoria,
    imagen: productoSeleccionado.imagen,
    alt: productoSeleccionado.alt
  })
}

//VINCULA A BOTON "editar producto"  del modal de "EDITAR"
editarProducto(){
  let datos: Producto = {
    //Solo idProducto rno se modifica por el usuario
    idProducto: this.productoSeleccionado.idProducto,
    /* Los demas atributos reciben nueva info desde el formulario */
    nombre: this.producto.value.nombre!,
    precio: this.producto.value.precio!,
    descripcion: this.producto.value.descripcion!,
    categoria: this.producto.value.categoria!,
    imagen: this.producto.value.imagen!,
    alt: this.producto.value.alt!
  }

  this.servicioCrud.modificarProducto(this.productoSeleccionado.idProducto, datos)
  .then(producto=> {
    alert("El producto se ha modificado con exito");

    // Resetea el formulario y las casillas quedan vacias
    this.producto.reset();
  })
  .catch(error=> {
    alert("Hubo un problema al modificar el producto \n"+error)
  })
}
}

