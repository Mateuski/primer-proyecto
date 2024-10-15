
import { CanActivateFn } from '@angular/router';

// Inject -> inyeccion de servicios
import { inject, Injectable } from '@angular/core';

import { AuthService } from '../modules/autentificacion/services/auth.service';

import { Router } from '@angular/router';

// Operadores tipo "observable"
import { map, switchMap, of, from } from 'rxjs';



export const rutaProtegidaGuard: CanActivateFn = (route, state) => {
  // Inyectamos / instaciamos servicio de autentificacion en el guardian (forma local)
const servicioAuth = inject (AuthService)

// Inyectamos / instanciamos servicio de rutas de forma local
const servicioRutas = inject (Router)

// Especificamos cual es el rol que va a esperar el guardian para activarse
const rolEsperado = "admin"

return true; 
};
