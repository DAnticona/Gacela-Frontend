import { ProyeccionEquipoDet } from './proyeccionEquipoDet.model';
import { RatioDevolucion } from './ratioDevolucion.model';
import { RpoPlan } from './rpoPlan.model';

export class ProyeccionEquipoCab {

    coProyEquipo = '';
    coProyVenta = '';
    coFile = '';
    
    tipo = 'DR';
    feProyeccion = new Date();
    fgActi= 'A';
    nroSem = 0;
    
    stock2Sd = 0 ;
    stock4Sd = 0 ;
    stock4Sh = 0 ;
    stock4Rh = 0 ;
    
    detalles = new Array<ProyeccionEquipoDet>();
    
    to2SdNoFe = 0 ;
    to2SdFe = 0 ;
    to4SdNoFe = 0 ;
    to4SdFe = 0 ;
    to4ShNoFe = 0 ;
    to4ShFe = 0 ;
    to4RhNoFe = 0 ;
    to4RhFe = 0 ;
    to2SdNoFePick = 0 ;
    to2SdFePick = 0 ;
    to4SdNoFePick = 0 ;
    to4SdFePick = 0 ;
    to4ShNoFePick = 0 ;
    to4ShFePick = 0 ;
    to4RhNoFePick = 0 ;
    to4RhFePick = 0 ;

    to2SdBook = 0 ;
    to4SdBook = 0 ;
    to4ShBook = 0 ;
    to4RhBook = 0 ;
    
    to2SdPick = 0 ;
    to4SdPick = 0 ;
    to4ShPick = 0 ;
    to4RhPick = 0 ;

    ratioDevolucion = new RatioDevolucion();

    rpoPlan = new Array<RpoPlan>();

    available2Sd = 0 ;
    available4Sd = 0 ;
    available4Sh = 0 ;
    available4Rh = 0 ;
 
    usCrea = '';
    feCrea = new Date();
    usModi = '';
    feModi = new Date();

}