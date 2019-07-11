import { Persona } from './persona';
import { Perfil } from './perfil';
import { Menu } from './menu';

export class Usuario extends Persona{
    coUsua: String;
	noUsua: String;
	feUltSes: String;
	usCreaUsua: String;
	usModiUsua: String;
	feCreaUsua: String;
	feModiUsua: String;

	perfil: Perfil;

	menus: Menu[];
}
