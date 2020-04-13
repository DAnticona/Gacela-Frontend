import { ProyeccionVentaDet } from './proyeccion-venta.model-det';

export class ProyeccionVentaCab {

   coProyeccion: string;
   tipo: string;
   feProyeccion: Date;
   fgActi: string;
   nroSem: number;
   coFile: string;
   
   to2SdNoFe: number;
   to2SdFe: number;
   to4SdNoFe: number;
   to4SdFe: number;
   to4ShNoFe: number;
   to4ShFe: number;
   to4RhNoFe: number;
   to4RhFe: number;

   to2SdNoFePick: number;
   to2SdFePick: number;
   to4SdNoFePick: number;
   to4SdFePick: number;
   to4ShNoFePick: number;
   to4ShFePick: number;
   to4RhNoFePick: number;
   to4RhFePick: number;

   to2SdBook: number;
   to4SdBook: number;
   to4ShBook: number;
   to4RhBook: number;

   to2SdPick: number;
   to4SdPick: number;
   to4ShPick: number;
   to4RhPick: number;

   usCrea: string;
   feCrea: Date;
   usModi: string;
   feModi: Date;

   detalles: Array<ProyeccionVentaDet>;

}