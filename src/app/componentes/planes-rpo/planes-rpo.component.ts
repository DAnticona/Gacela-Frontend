import { Component, Output, EventEmitter } from '@angular/core';
import { RpoPlan } from 'src/app/modelos/rpo-plan.model';
import { RpoPlanService } from 'src/app/servicios/rpo-plan.service';
import { ParamsService } from 'src/app/servicios/params.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogListarNavesComponent } from '../opciones/maestros/naves/dialog-listar-naves/dialog-listar-naves.component';
import { DialogRegistroRpoPlanComponent } from '../modales/dialog-registro-rpo-plan/dialog-registro-rpo-plan.component';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

/**
 * Controlador para los planes RPO, muestra, actualiza y registra planes RPO.
 * Valida fechas y montos de los planes RPO, en caso de ser inválidos iguala los montos involucrados a cero
 * - Autor: David Anticona - <danticona@wollcorp.com>
 * - Creado el: 17/04/2020
 */
@Component({
	selector: 'app-planes-rpo',
	templateUrl: './planes-rpo.component.html',
	styleUrls: ['./planes-rpo.component.css'],
	providers: [DatePipe],
})
export class PlanesRpoComponent {
	/**
	 * Variable que almacena las url para conectarse al backend
	 */
	private urls: any;

	/**
	 * Variable que almacena el token de la sesión para conectarse al backend
	 */
	private token: string;

	/**
	 * Variable que almacena los planes RPO
	 */
	public rpoPlan: RpoPlan[] = [];

	/**
	 * Variable que almacena la fecha de hoy
	 */
	public today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	/**
	 * Variable que controla si el componente está cargando.
	 */
	public cargando = false;

	/**
	 * Variable que envía los planes RPO al componente padre.
	 */
	@Output() enviaRpoPlan = new EventEmitter();

	/**
	 * Variable que envía el estado de este componente al padre.
	 */
	@Output() enviaCargando = new EventEmitter();

	constructor(
		private paramService: ParamsService,
		private rpoPlanService: RpoPlanService,
		public dialog: MatDialog,
		public datepipe: DatePipe
	) {
		this.urls = this.paramService.urls;
		this.token = this.paramService.conexion.token;

		this.obtieneRpoPlan();
	}

	/**
	 * Método que obtiene los planes RPO desde la base de datos.
	 */
	public obtieneRpoPlan() {
		this.cargando = true;
		this.enviaCargando.emit(this.cargando);

		this.rpoPlanService.obtieneRpoPlan(this.urls, this.token).subscribe((res: any) => {
			this.rpoPlan = res.body.planes.planes;

			this.cargando = false;
			this.enviaCargando.emit(this.cargando);
			this.enviaRpoPlan.emit(this.rpoPlan);
		});
	}

	/**
	 * Método lanzado al hacer click al boton "+"
	 * agrega un nuevo registro al RPO plan
	 */
	public agregarRpo() {
		this.getNave()
			.then(alNave => {
				let rpo = new RpoPlan();

				rpo.coRpo = null;
				rpo.alNaveRpo = alNave;
				rpo.viajeRpo = null;
				rpo.ca2SdRpo = 0;
				rpo.ca4SdRpo = 0;
				rpo.ca4ShRpo = 0;
				rpo.etaRpo = this.today;
				rpo.fgActiRpo = 'A';

				this.registraRpoDialog(rpo);
			})
			.catch(err => console.log(err));
	}

	/**
	 * Método lanzado al dar click al boton Editar RPO plan.
	 * Copia el rpo a editar y lo envía al método registraRpoDialog.
	 */
	public editarRpo(i: number) {
		this.registraRpoDialog(this.rpoPlan[i]);
	}

	/**
	 * Método que llama al componente DialogRegistrarRpoPlan.
	 * Registra o actualiza los datos de un RPO en la base de datos.
	 * @param rpo Es el Rpo a registrar o actualizar.
	 */
	private registraRpoDialog(rpo: RpoPlan) {
		const dialogRef = this.dialog.open(DialogRegistroRpoPlanComponent, {
			width: '1000px',
			height: '500px',
			data: rpo,
		});

		dialogRef.afterClosed().subscribe(res => {
			this.obtieneRpoPlan();
		});
	}

	/**
	 * Método lanzado al dar click en eliminar registro RPO.
	 * @param index Índice del registro del RPO plan para, permite identificar el registro a eliminar.
	 */
	public eliminarRpo(i: number) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Esta acción no se puede revertir',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, estoy seguro!',
			cancelButtonText: 'Cancelar',
		}).then(result => {
			if (result.value) {
				this.rpoPlanService.eliminaRpoPlan(this.urls, this.token, this.rpoPlan[i]).subscribe(res => {
					this.obtieneRpoPlan();
				});
				Swal.fire({
					title: 'Eliminado!',
					text: 'Este registro ha sido eliminado',
					icon: 'success',
					timer: 2000,
					showConfirmButton: false,
				});
			}
		});
	}

	/**
	 * Consulta y permite seleccionar una nave a partir del maestro de naves de la BD.
	 * Llama una ventana dialog que muestra el maestro de naves.
	 * @returns El código de la nave seleccionada.
	 */
	private async getNave(): Promise<any> {
		const promesa = await new Promise((resolve, reject) => {
			const dialogRef = this.dialog.open(DialogListarNavesComponent, {
				width: '1000px',
				height: '800px',
			});

			dialogRef.afterClosed().subscribe((alNave: string) => {
				if (!alNave) {
					let error = new Error('No seleccionó ninguna nave...');
					reject(error);
				}

				resolve(alNave);
			});
		});

		return promesa;
	}
}
