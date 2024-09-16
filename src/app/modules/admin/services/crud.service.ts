import { Injectable } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

// Importaciones para manejo de archivos y referencias
import { getDownloadURL, getStorage, ref, UploadResult, uploadString, deleteObject } from 'firebase/storage';
/*
  getDownloadUrl -> Para obtener la URL de descarga de una imagen subida
  getStorage -> Para obtener la instancia de almacenamiento
  ref -> Para crear referencias a ubicaciones en el almacenamiento
  UploadResult -> Tipo que representa el resultado de una operacion subida
  UploadString -> Para subir imagenes en formato de cadena
  deleteObject -> Para eliminar un espacio en el almacenamiento
*/

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  // Definimos colección para los productos de la web
  private productosCollection: AngularFirestoreCollection<Producto>

  // Definir variable "Respuesta" que podra subir resultados
  private respuesta!: UploadResult;

  // Inicializar servicio de Storage
  private storage = getStorage();

  constructor(private database: AngularFirestore) {
    this.productosCollection = database.collection('producto');
  }

  // CREAR productos -> obtiene datos del formulario y url de la imagen
  crearProducto(producto: Producto, url: string){
    return new Promise(async(resolve, reject) => {
      try{
        // Creamos número identificativo para el producto en la base de datos
        const idProducto = this.database.createId();

        // Asignamos ID creado al atributo idProducto de la interfaz Producto
        producto.idProducto = idProducto;

        // Asignamos URL recibida del parametro al atributo "imagen" de interfaz Producto
        producto.imagen = url;

        const resultado = await this.productosCollection.doc(idProducto).set(producto);

        resolve(resultado);
      } catch (error){
        reject(error);
      }
    })
  }

  // OBTENER productos
  obtenerProducto(){
    /*
      snapshotChanges => toma captura del estado de los datos
      pipe => tuberías que retornan un nuevo arreglo
      map => "mapea" o recorre esa nueva información
      a => resguarda la nueva información y la envía como un documento 
    */
    return this.productosCollection.snapshotChanges().pipe(map(action => action.map(a => a.payload.doc.data())))
  }

  // EDITAR productos
  modificarProducto(idProducto: string, nuevaData: Producto){
    /*
    Accedemos a la coleccion "productos" de la Base de Datos, buscamos el ID del
    producto seleccionado y lo actualizamos con el metodo "uptade" enviando la nueva info
    */
    return this.database.collection('producto').doc(idProducto).update(nuevaData)
  }
  // ELIMINAR productos
  eliminarproducto(idProducto:string, imagenurl: string){
    return new Promise((resolve, reject) => {
      try{

        // Definimos referencias localmente de Storage
        const storage= getStorage();

        // Obtiene la referencia desde el almacenamiento de Storage
        const referenciaImagen = ref(storage, imagenurl);

        // Eliminamos la imagen desde el almacenamiento
        deleteObject(referenciaImagen)
        .then(() => {
          
          const respuesta = this.productosCollection.doc(idProducto).delete();

          resolve (respuesta);

        })
        .catch(error => {
          reject("Error al eliminar la imagen: \n"+error);
        })
      }
      catch(error){
        reject (error);
      }
    })
  }

  obtenerUrlImagen(respuesta: UploadResult){
    // Retorna URL obtenido como REFERENCIA
    return getDownloadURL(respuesta.ref)
  }

  /**
   * 
   * @param {string} nombre <- nombre de la imagen
   * @param {any} imagen <- tipo de imagenes que se pueden subir
   * @param {string} ruta <- ruta de almacenamiento de las imagenes
   * @returns <- se retorna lo obtenido
   */

  // SUBIR imagen con sus referencias
  async subirImagen(nombre: string, imagen:any, ruta: string){
    try{
      // Crear una referencia de imagen
      // Ruta (carpeta) / nombre (nombreImagen)
      let referenciaImagen = ref(this.storage, ruta + '/' + nombre)

      // Asignarle a la respuesta la info de las imagenes subidas
      this.respuesta = await uploadString(referenciaImagen, nombre, 'data_url')

      .then(resp => {
        return resp;
      })
      return this.respuesta;
    }
    catch(error){
      console.log(error);

      return this.respuesta;
    }
  }
}
