import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NavesService } from '../../../../../servicios/naves.service';
import { ParamsService } from 'src/app/servicios/params.service';

@Component({
  selector: 'app-dialog-listar-naves',
  templateUrl: './dialog-listar-naves.component.html',
  styleUrls: ['./dialog-listar-naves.component.css']
})
export class DialogListarNavesComponent implements OnInit {

  naves: any[] = [];
  navesFiltradas: any[] = [];

  codigoSol: string;

  token: string;
  urls: any;

  constructor(public dialogRef: MatDialogRef<DialogListarNavesComponent>,
              private navesService: NavesService,
              private paramsService: ParamsService) {

    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;
    
    this.navesService.getNaves(this.token, this.urls)
      .subscribe((res: any) => {
        // console.log(res);
        this.naves = res.body.navesTemp;

        this.navesFiltradas = this.naves;

        // console.log(this.navesFiltradas);
      });

  }

  ngOnInit() {
  }


  filtrar(codigo: string, nombreCorto: string, nombreLargo: string, estado: string) {

    if(estado === '99') {
      estado = '';
    }

    this.navesFiltradas = this.naves.filter(nave => {

      if(estado !== '99') {

        return nave.codigo.includes(codigo.toUpperCase()) && nave.fgActi.includes(estado) &&
                nave.shortName.includes(nombreCorto.toUpperCase()) && nave.longName.includes(nombreLargo.toUpperCase());

      }

    });

    // console.log(this.archivosFiltrados);

  }


  seleccionar(i: number) {

    this.codigoSol = this.navesFiltradas[i].shortName;
    
  }


  onAceptar() {

    // this.dialogRef.close(this.forma.value);
    // console.log(this.codigoSel);
    this.dialogRef.close(this.codigoSol);

  }

  onCancelar(): void {

    this.dialogRef.close();

  }


}
