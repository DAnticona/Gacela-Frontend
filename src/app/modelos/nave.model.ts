import { Servicio } from '../models/servicio.model';
import { Linea } from '../models/linea.model';

export class Nave {
	coNave: string;
	noNave: string;
	alNave: string;
	servicio: Servicio;
	linea: Linea;
	fgActi: string;
	usCrea: string;
	usModi: string;
	feCrea: Date;
	feModi: Date;
}
