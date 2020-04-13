import { ProyeccionFileDet } from './proyeccionFileDet.model';

export class ProyeccionFileCab {

    codigo: string;
	noFile: string;
	feCargaFile = new Date();
	fgActi: string;
	usCrea: string;
	usModi: string;
	feCrea = new Date();
	feModi = new Date();
    detalle: Array<ProyeccionFileDet>;
    
}