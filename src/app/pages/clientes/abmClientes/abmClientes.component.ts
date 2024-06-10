import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { ClientesService } from '../../../services/clientes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../components/modal/modal.component';
import { RouterModule } from '@angular/router';
import { FechaPipe } from '../../../pipes/fecha.pipe';

@Component({
  standalone: true,
  selector: 'app-abmClientes',
  templateUrl: './abmClientes.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    RouterModule,
    FechaPipe
  ],
  styleUrls: []
})
export default class AbmClientesComponent implements OnInit {

  @Output()
  public insertEvent = new EventEmitter<any>();

  @Output()
  public updateEvent = new EventEmitter<any>();

  public abmForm = {
    descripcion: '',
    tipoIdentificacion: '',
    identificacion: '',
    telefono: '',
    email: '',
    domicilio: '',
  }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public clientesService: ClientesService,
  ) { }

  ngOnInit() { }

  nuevoCliente(): void {

    // Verificacion
    if (this.clientesService.abmForm.descripcion.trim() === '') return this.alertService.info('El nombre o razon social es obligatorio');

    this.alertService.loading();
    const data = {
      ...this.clientesService.abmForm,
      creatorUserId: this.authService.usuario.userId,
    }
    this.clientesService.nuevoCliente(data).subscribe({
      next: ({ cliente }) => {
        this.insertEvent.emit(cliente);
        this.clientesService.showModalAbm = false;
        this.reiniciarForm();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  actualizarCliente(): void {

    // Verificacion
    if (this.clientesService.abmForm.descripcion.trim() === '') return this.alertService.info('El nombre o razon social es obligatorio');

    this.alertService.loading();
    const data = {
      ...this.clientesService.abmForm,
      creatorUserId: this.authService.usuario.userId,
    }

    this.clientesService.actualizarCliente(this.clientesService.clienteSeleccionado.id, data).subscribe({
      next: ({ cliente }) => {
        this.updateEvent.emit(cliente);
        this.clientesService.showModalAbm = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  reiniciarForm(): void {
    this.abmForm = {
      descripcion: '',
      tipoIdentificacion: '',
      identificacion: '',
      telefono: '',
      email: '',
      domicilio: '',
    }
  }

  submit(): void {
    this.clientesService.estadoAbm === 'crear' ? this.nuevoCliente() : this.actualizarCliente();
  }

}
