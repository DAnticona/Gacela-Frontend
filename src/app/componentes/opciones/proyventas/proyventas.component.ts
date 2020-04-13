import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsService } from '../../../servicios/params.service';
import { ProyeccionService } from '../../../servicios/proyeccion-venta.service';

@Component({
  selector: 'app-proyventas',
  templateUrl: './proyventas.component.html',
  styleUrls: ['./proyventas.component.css']
})
export class ProyventasComponent {

  token: string;
  urls: any;

  today = new Date();
  lastWeek: Date;

  proyecciones: any[] = [];
  proyeccionesFiltradas: any[] = [];

  codigoSel: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private paramsService: ParamsService,
              private proyeccionService: ProyeccionService) {

    this.today.setMinutes(this.today.getMinutes() + this.today.getTimezoneOffset());

    this.lastWeek = new Date(this.today.getTime() - (1000*60*60*24*7));

    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.proyeccionService.getProyecciones(this.token, this.urls)
      .subscribe((res: any) => {

        // console.log(res);

        this.proyecciones = res.body.listaProyeccionesVenta;

        
        this.proyecciones.forEach((p: any) => {

          p.feProyeccion = new Date(p.feProyeccion + 'T00:00:00');

        });
        

        this.filtrar('', '', this.lastWeek.toISOString().slice(0,10), this.today.toISOString().slice(0,10), 'A');

      });

  }

  filtrar(tipo: string, coProyeccion: string, fechaIni: string, fechaFin: string, estado: string) {

    fechaIni = fechaIni + 'T00:00:00';
    fechaFin = fechaFin + 'T00:00:00';

    this.proyeccionesFiltradas = this.proyecciones.filter(proyeccion => {

    return proyeccion.tipo.includes(tipo) && proyeccion.coProyeccion.includes(coProyeccion.toUpperCase()) && proyeccion.fgActi.includes(estado)
    && proyeccion.feProyeccion.getTime() >= (new Date(fechaIni)).getTime() && proyeccion.feProyeccion.getTime() <= (new Date(fechaFin)).getTime();

    });

  }


  seleccionar(i: number) {

    this.codigoSel = this.proyeccionesFiltradas[i].coProyeccion;
    
  }

  nuevaProyeccion() {

    this.router.navigate(['nuevo'], { relativeTo: this.route });

  }

  abrirProyeccion() {

    // console.log(this.codigoSel);

    if(!this.codigoSel) {

      return;

    }

    this.router.navigate([this.codigoSel], { relativeTo: this.route });
    
  }

}

