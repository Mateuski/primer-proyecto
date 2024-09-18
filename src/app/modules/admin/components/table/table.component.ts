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

  modalVisibleproducto: boolean = false

  productoSeleccionado!: Producto // ! <- tomar valores vacios

  nombreImagen!: string;  // obtendra el nombre de la imagen

  imagen!: string;  // obtendra la ruta de la imagen

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
    // imagen: new FormControl('', Validators.required),
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
        imagen: '',
        alt: this.producto.value.alt!
      }

      /// Enviamos nombre y url de la imagen; definimos carpeta de imagenes como "productos"
      await this.servicioCrud.subirImagen(this.nombreImagen, this.imagen, "productos")
        .then(resp => {
          // encapsulamos respuesta y enviamos la info obtenida
          this.servicioCrud.obtenerUrlImagen(resp)
            .then(url => {
              // Ahora metodo crearProducto recibe datos del formulario y URL creada
              this.servicioCrud.crearProducto(nuevoProducto, url)
                .then(producto => {
                  alert("Ha agregado un nuevo producto con éxito.");
                })
                .catch(error => {
                  alert("Ha ocurrido un error al cargar un producto.");
                })
            })
        })
    }
  }

  // CARGAR IMAGENES
  cargarImagen(event: any) {
    // Variable para obtener el archivo subido desde el input HTML
    let archivo = event.target.files[0];

    // Variable para crear un nuevo objeto de tipo "archivo" o "file" y leerlo
    let reader = new FileReader();

    if (archivo != undefined) {
      /* 
      llamamos a metodo readAsDataURL para leer toda la info recibida
      Enviamos como parametro al "archivo" porque sera el encargado de tener
      la info ingresada por el usuario 
      */
      reader.readAsDataURL(archivo);

      // Definimos que haremos con la info mediante función flecha
      reader.onloadend = () => {
        let url = reader.result;

        // Condicionamos según una URL existente y no "nula"
        if (url != null) {
          // Definimos nombre de la imagen con atributo "name" del input
          this.nombreImagen = archivo.name;

          // Definimos ruta de la imagen según la url recibida
          this.imagen = url.toString();
        }
      }
    }
  }

  //funcion vinculada al modal y el boton de la tabla
  mostrarBorrar(productoSeleccionado: Producto) {
    this.modalVisibleproducto = true;

    this.productoSeleccionado = productoSeleccionado;
  }

  borrarProducto() {
    /*
     Ahora envíamos tanto el ID del producto (para identificarlo en Firestore)
     y la URL de la imagen (para identificarlo en Storage)
     ID y URL <- identificadores propios de cada archivo en la Base de Datos
   */
    this.servicioCrud.eliminarproducto(this.productoSeleccionado.idProducto, this.productoSeleccionado.imagen)
      .then(respuesta => {
        alert("se ha podido eliminar con exito");
      })
      .catch(error => {
        alert("Ha ocurrido un error al eliminar un producto: \n" + error)
      })
  }

  //EDITAR PRODUCTO
  mostrarEditar(productoSeleccionado: Producto) {
    this.productoSeleccionado = productoSeleccionado
    /*
    *Tomo los valores del producto seleccionado y los va a
    autocompletar en el formulario del modal
      (menos el ID y la URL de la imagen)
    */
    this.producto.setValue({
      nombre: productoSeleccionado.nombre,
      precio: productoSeleccionado.precio,
      descripcion: productoSeleccionado.descripcion,
      categoria: productoSeleccionado.categoria,
      //imagen: productoSeleccionado.imagen,
      alt: productoSeleccionado.alt
    })
  }

  //VINCULA A BOTON "editar producto"  del modal de "EDITAR"
  editarProducto() {
    let datos: Producto = {
      //Solo idProducto rno se modifica por el usuario
      idProducto: this.productoSeleccionado.idProducto,
      /* Los demas atributos reciben nueva info desde el formulario */
      nombre: this.producto.value.nombre!,
      precio: this.producto.value.precio!,
      descripcion: this.producto.value.descripcion!,
      categoria: this.producto.value.categoria!,
      imagen: this.productoSeleccionado.imagen!,
      alt: this.producto.value.alt!
    }

    // Verificamos si el usuario ingresa o no una nueva imagen
    if (this.imagen) {
      this.servicioCrud.subirImagen(this.nombreImagen, this.imagen, "productos")
        .then(resp => {
          this.servicioCrud.obtenerUrlImagen(resp)
            .then(url => {
              datos.imagen = url; // Actualizamos URL de la imagen en los datos del formulario

              this.actualizarProducto(datos); // Actualizamos los datos

              this.producto.reset(); // Vaciar las casillas del formulario
            })
            .catch(error => {
              alert("Hubo un problema al subir la imagen :( \n" + error);

              this.producto.reset();
            })
        })
    } else {
      /*
        Actualizamos formulario con los datos recibidos del usuario, pero sin 
        modificar la imagen ya existente en Firestore y en Storage
      */
      this.actualizarProducto(datos);
    }
  }

  // ACTUALIZAR la información ya existente de los productos
  actualizarProducto(datos: Producto) {

    // Enviamos al método el id del producto seleccionado y los datos actualizados
    this.servicioCrud.modificarProducto(this.productoSeleccionado.idProducto, datos)
      .then(producto => {
        alert("El producto se ha modificado con exito");

        // Resetea el formulario y las casillas quedan vacias
        this.producto.reset();
      })
      .catch(error => {
        alert("Hubo un problema al modificar el producto \n" + error)
      })
  }
}

