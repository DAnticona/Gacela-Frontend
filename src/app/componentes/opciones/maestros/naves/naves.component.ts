import { Component } from '@angular/core';
import { NavesService } from 'src/app/servicios/naves.service';
import { ParamsService } from 'src/app/servicios/params.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-naves',
  templateUrl: './naves.component.html',
  styleUrls: ['./naves.component.css']
})
export class NavesComponent {

  naves: any[] = [];
  navesFiltradas: any[] = [];

  codigoSel: string = null;

  token: string;
  urls: any;

  // VARIABLES PARA FUNCIONAMIENTO
  nroRegs = 10;
  paginas: number[] = [];
  filtro = false;
  pagActual = 0;


  constructor(private navesService: NavesService,
              private paramsService: ParamsService,
              private router: Router,
              private route: ActivatedRoute) {


    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;
                
    this.navesService.obtieneNaves(this.token, this.urls)
      .subscribe((res: any) => {
        
        this.naves = res.body.naves;

        this.naves.forEach(n => {
          if(n.fgActi === 'S') {

            n.fgActi = 'A';

          } else {

            n.fgActi = 'I';
            
          }
        });

        this.obtienePaginas(this.nroRegs);

        this.obtieneRegistrosXPagina(0, this.nroRegs);

        });
  }


  obtienePaginas(nroRegs: number) {

    let nroPags = Math.ceil(this.naves.length/nroRegs);
    this.paginas = Array(nroPags).fill(nroPags);

  }

  obtieneRegistrosXPagina(nroPag: number, nroRegs: number) {

    this.pagActual = nroPag;

    let start = nroPag * nroRegs;
    let end = (nroPag + 1) * nroRegs;

    this.navesFiltradas = this.naves.slice(start, end);

  }

  cambiaNroRegistros(nroRegs: number) {

    this.nroRegs = nroRegs;

    this.obtienePaginas(this.nroRegs);
    this.obtieneRegistrosXPagina(0, this.nroRegs);

  }


  filtrar(codigo: string, nombreCorto: string, nombreLargo: string, estado: string) {

    this.filtro = true;

    if(estado === '99') {
      estado = '';
    }

    this.navesFiltradas = this.naves.filter(nave => {

      if(estado !== '99') {

        return nave.coNave.includes(codigo.toUpperCase()) && nave.fgActi.includes(estado) &&
                nave.alNave.includes(nombreCorto.toUpperCase()) && nave.noNave.includes(nombreLargo.toUpperCase());

      }

    });

    if(codigo.length === 0 && nombreCorto.length === 0 && nombreLargo.length === 0 && estado.length === 0) {

      this.filtro = false;
      this.obtieneRegistrosXPagina(0, this.nroRegs);

    }

  }


  seleccionar(i: number) {

    this.codigoSel = this.navesFiltradas[i].coNave;
    
  }


  onAceptar() {

    if(this.codigoSel === null) {
      this.codigoSel = 'nuevo';
    }

    this.router.navigate([this.codigoSel], { relativeTo: this.route });

  }

}
