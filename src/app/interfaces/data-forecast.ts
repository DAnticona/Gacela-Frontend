import { Nave } from '../clases/nave';
import { Servicio } from './../clases/servicio';

export interface DataForecast {
    naves: Nave[];
    servicios: Servicio[];
}
