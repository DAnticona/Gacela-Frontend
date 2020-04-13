import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup } from '@angular/forms';
import { ProyeccionService } from 'src/app/servicios/proyeccion-venta.service';
import { ParamsService } from 'src/app/servicios/params.service';
import { FileMTC1R999Service } from '../../../../servicios/file-mtc1-r999.service';

@Component({
  selector: 'app-buscar-proyventasol-dialog',
  templateUrl: './buscar-proyventasol-dialog.component.html',
  styleUrls: ['./buscar-proyventasol-dialog.component.css']
})
export class BuscarProyventasolDialogComponent implements OnInit {

  archivos: any[] = [];
  archivosFiltrados: any[] = [];

  codigoSel: string;

  token: string;
  urls: any;


  today = new Date();
  lastWeek = new Date(this.today.getTime() - (1000*60*60*24*7));

  constructor(public dialogRef: MatDialogRef<BuscarProyventasolDialogComponent>,
              private proyeccionService: ProyeccionService,
              private paramsService: ParamsService,
              private fileMTC1R999Service: FileMTC1R999Service) {

    
    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.fileMTC1R999Service.listarFiles(this.token, this.urls)
      .subscribe((res: any) => {

        this.archivos = res.body.filesCab;

        this.archivos.forEach(a => {

          a.feCargaFile = new Date(a.feCargaFile + 'T00:00:00.000');

        });

        this.archivosFiltrados = this.archivos.filter(a => a.fgActi === 'A');

        // console.log(this.archivos);

      });

    /*
    this.proyeccionService.getFiles(this.token, this.urls)
      .subscribe((res: any) => {

        // console.log(res.body.proyecciones);
        this.archivos = res.body.proyecciones;

        this.archivos.forEach(a => {

          a.feCargaFile = new Date(a.feCargaFile + 'T00:00:00.000');

        });

        this.archivosFiltrados = this.archivos.filter(a => a.fgActi === 'A');

        // console.log(this.archivos);

      });
      */


    

    // console.log(this.proyeccionesFiltradas);


    

  }

  ngOnInit() {
  }


  filtrar(codigo: string, noFile: string, fechaIni: string, fechaFin: string, fgActi: string) {

    fechaIni = fechaIni + 'T00:00:00';
    fechaFin = fechaFin + 'T00:00:00';

    if(fgActi === '99') {
      fgActi = '';
    }

    this.archivosFiltrados = this.archivos.filter(a => {

      if(fgActi !== '99') {

        return a.coFile.includes(codigo.toUpperCase()) && a.noFile.includes(noFile.toUpperCase()) && a.fgActi.includes(fgActi)
        && a.feCargaFile.getTime() >= (new Date(fechaIni)).getTime() && a.feCargaFile.getTime() <= (new Date(fechaFin)).getTime();

      }

    });

    // console.log(this.archivosFiltrados);

  }


  seleccionar(i: number) {

    this.codigoSel = this.archivosFiltrados[i].coFile;
    
  }


  onAceptar() {

    // this.dialogRef.close(this.forma.value);
    // console.log(this.codigoSel);
    this.dialogRef.close(this.codigoSel);

  }

  onCancelar(): void {

    this.dialogRef.close();

  }

}
