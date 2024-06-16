import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { ObrasMaderaService } from '../../../services/obras-madera.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { ModalComponent } from '../../../components/modal/modal.component';
import { RouterModule } from '@angular/router';
import { format } from 'date-fns';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  standalone: true,
  selector: 'app-abmObrasMadera',
  templateUrl: './abmObrasMadera.component.html',
  styleUrls: [],
  imports:[
    CommonModule,
    FormsModule,
    FechaPipe,
    ModalComponent,
    RouterModule,
  ]
})
export default class AbmObrasMaderaComponent implements OnInit {

  @Output()
  public insertEvent = new EventEmitter<any>();

  @Output()
  public updateEvent = new EventEmitter<any>();

  public clientes: any[] = [];
  public loadingClientes = false;

  constructor(
    private authService: AuthService,
    private clientesService: ClientesService,
    private alertService: AlertService,
    public obrasMaderaService: ObrasMaderaService,
  ) { }

  ngOnInit() {
    this.loadingClientes = true;
    this.clientesService.listarClientes({ direccion: 'asc', columna: 'descripcion', activo: 'true' }).subscribe({
      next: ({ clientes }) => {
        this.clientes = clientes;
        this.loadingClientes = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  nuevaObra(): void {

    const {
      fechaInicio,
      codigo,
      clienteId,
      descripcion,
      domicilio,
    } = this.obrasMaderaService.abmForm;

    // Verificacion
    if (this.obrasMaderaService.abmForm.fechaInicio.trim() === '') return this.alertService.info('Debe colocar una fecha');
    if (this.obrasMaderaService.abmForm.codigo.trim() === '') return this.alertService.info('El código es obligatorio');
    if (this.obrasMaderaService.abmForm.clienteId.trim() === '') return this.alertService.info('Debe seleccionar un cliente');

    this.alertService.loading();

    // Adaptando fechas
    const fechaInicioAdt = new Date(fechaInicio);
    fechaInicioAdt.setHours(fechaInicioAdt.getHours() + 3);

    const data = {
      codigo,
      fechaInicio: fechaInicioAdt,
      clienteId: Number(clienteId),
      descripcion,
      domicilio,
      creatorUserId: this.authService.usuario.userId,
    }

    this.obrasMaderaService.nuevaObra(data).subscribe({
      next: ({ obra }) => {
        this.insertEvent.emit(obra);
        this.obrasMaderaService.showModalAbm = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  actualizarObra(): void {

    const {
      fechaInicio,
      codigo,
      clienteId,
      descripcion,
      domicilio,
    } = this.obrasMaderaService.abmForm;

    // Verificacion
    if (this.obrasMaderaService.abmForm.fechaInicio.trim() === '') return this.alertService.info('Debe colocar una fecha');
    if (this.obrasMaderaService.abmForm.codigo.trim() === '') return this.alertService.info('El código es obligatorio');

    this.alertService.loading();

    // Adaptando fechas
    const fechaInicioAdt = new Date(fechaInicio);
    fechaInicioAdt.setHours(fechaInicioAdt.getHours() + 3);

    const data = {
      codigo,
      fechaInicio: fechaInicioAdt,
      clienteId: Number(clienteId),
      descripcion,
      domicilio,
      creatorUserId: this.authService.usuario.userId,
    }

    this.obrasMaderaService.actualizarObra(this.obrasMaderaService.obraSeleccionada.id, data).subscribe({
      next: ({ obra }) => {
        this.updateEvent.emit(obra);
        this.obrasMaderaService.showModalAbm = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  submit(): void {
    this.obrasMaderaService.estadoAbm === 'crear' ? this.nuevaObra() : this.actualizarObra();
  }

}
