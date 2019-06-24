import { Persona } from './persona';
import { Perfil } from './perfil';
import { Submenu } from './submenu';

export class Usuario extends Persona{
    coUsua: String;
	noUsua: String;
	feUltSes: String;
	usCreaUsua: String;
	usModiUsua: String;
	feCreaUsua: String;
	feModiUsua: String;

	perfil: Perfil;

	subMenus: Submenu[];
}
