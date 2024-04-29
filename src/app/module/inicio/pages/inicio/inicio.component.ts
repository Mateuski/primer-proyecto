import { Component } from '@angular/core';
//importamos nuestra interfaz
import { Juego } from 'src/app/models/juego';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
//propiedad publica (TIPO: ARRAY)
public Info: Juego[];

constructor(){
  this.Info = [
    {
    id: "",
    nombre: "Fear & Hunger",
    genero: "survival horror",
    precio: 7,
    imagen: "https://m.media-amazon.com/images/M/MV5BZWE4MDEyNzItMzYzOS00YWUwLWI4NjYtOWRjNTk5Nzc4NDhiXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_FMjpg_UX1000_.jpg",
    alt: "Portada de Fear & Hunger"
    },
    {
    id: "",
    nombre: "Dragon Ball Xenoverse 2",
    genero: "pelea",
    precio: 16,
    imagen: "https://cdn.akamai.steamstatic.com/steam/apps/454650/capsule_616x353.jpg?t=1711534423",
    alt: "Portada de DBX2"
    },
    {
      id: "",
      nombre: "Shadows of Doubt",
      genero: "simulacion",
      precio: 10,
      imagen: "https://cdn.akamai.steamstatic.com/steam/apps/986130/capsule_616x353_alt_assets_1.jpg?t=1712768904",
      alt: "Portada del SoD"
      },
  ]
}
}
