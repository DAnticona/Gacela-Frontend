import { ProyeccionEquipoDet } from './proyeccion-equipo-det.model';

export class ProyeccionEquipoCab {

    coTiProy: string;
	coProyEqui: string;
	coProyVenta: string;
	coFile: string;
	feProy: Date;
	fgActi: string;
	nroSem: number;
	stock2Sd: number;
	stock4Sd: number;
	stock4Sh: number;
	ratio2Sd: number;
	ratio4Sd: number;
	ratio4Sh: number;
	to2SdNoFe: number;
	to2SdNoFePick: number;
	to2SdFe: number;
	to2SdFePick: number;
	to4SdNoFe: number;
	to4SdNoFePick: number;
	to4SdFe: number;
	to4SdFePick: number;
	to4ShNoFe: number;
	to4ShNoFePick: number;
	to4ShFe: number;
	to4ShFePick: number;
	to2SdBook: number;
	to4SdBook: number;
	to4ShBook: number;
	to2SdPick: number;
	to4SdPick: number;
	to4ShPick: number;
	feEmptyReturn: Date;
	nroDiasHabiles: number;
	nroDiasAlRetorno: number;
	ca2SdEmptyRet: number;
	ca4SdEmptyRet: number;
	ca4ShEmptyRet: number;
	available2Sd: number;
	available4Sd: number;
	available4Sh: number;
	detalles: Array<ProyeccionEquipoDet>;
	usCrea: string;
	feCrea: Date;
	usModi: string;
    feModi: Date;
    
}