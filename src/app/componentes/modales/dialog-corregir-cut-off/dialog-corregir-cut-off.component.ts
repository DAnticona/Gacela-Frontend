import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ParamsService } from '../../../servicios/params.service';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-dialog-corregir-cut-off',
	templateUrl: './dialog-corregir-cut-off.component.html',
	styleUrls: ['./dialog-corregir-cut-off.component.css'],
	providers: [DatePipe],
})
export class DialogCorregirCutOffComponent implements OnInit {
	public cutOff = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

	/**
	 * Variable que controla el estado del componente.
	 */
	public cargando: boolean;
	constructor(
		private datepipe: DatePipe,
		private dialogRef: MatDialogRef<DialogCorregirCutOffComponent>,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public conflictos: any
	) {
		// this.forma.setValue(this.rpo);
		// this.forma.controls.etaRpo.setValue(this.datepipe.transform(this.rpo.etaRpo, 'yyyy-MM-dd'));
		// console.log(conflictos);
	}

	ngOnInit() {}

	onAceptar() {
		this.dialogRef.close(this.cutOff);
	}

	onCancelar(): void {
		this.dialogRef.close();
	}
}
