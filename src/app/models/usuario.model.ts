
export class UsuarioModel {

    coPers?: string;
    tiDocu: string;
    nuDocu: string;
    noPers: string;
    apPate: string;
    apMate?: string;
    sexo: string;
    feNaci: Date
    email: string;
    rutaImagen?: string;
    noUsua: string;
    noPerf: string;

    constructor() {

        this.feNaci = new Date();

    }
    
}