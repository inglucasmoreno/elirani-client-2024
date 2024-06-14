import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { ModalComponent } from '../../../components/modal/modal.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { TiposMueblesService } from '../../../services/tipos-muebles.service';

@Component({
  standalone: true,
  selector: 'app-abmTiposMuebles',
  templateUrl: './abmTiposMuebles.component.html',
  imports: [
    CommonModule,
    FormsModule,
    FechaPipe,
    ModalComponent,
    RouterModule,
  ],
  styleUrls: []
})
export default class AbmTiposMueblesComponent implements OnInit {

  @Output()
  public insertEvent = new EventEmitter<any>();

  @Output()
  public updateEvent = new EventEmitter<any>();

  public abmForm = {
    placas: 'false',
    descripcion: '',
  }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public tiposMueblesService: TiposMueblesService,
  ) { }

  ngOnInit() { }

  nuevoTipo(): void {

    // Verificacion
    if (this.tiposMueblesService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');

    this.alertService.loading();
    const data = {
      ...this.tiposMueblesService.abmForm,
      creatorUserId: this.authService.usuario.userId,
    }
    this.tiposMueblesService.nuevoTipo(data).subscribe({
      next: ({ tipo }) => {
        this.insertEvent.emit(tipo);
        this.tiposMueblesService.showModalAbm = false;
        this.reiniciarForm();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  actualizarTipo(): void {

    // Verificacion
    if (this.tiposMueblesService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');

    this.alertService.loading();

    const data: any = {
      ...this.tiposMueblesService.abmForm,
      creatorUserId: this.authService.usuario.userId,
    }

    // Se transforma el tipo de dato de placas a boolean
    data.placas = data.placas === 'true';

    this.tiposMueblesService.actualizarTipo(this.tiposMueblesService.tipoSeleccionado.id, data).subscribe({
      next: ({ tipo }) => {
        this.updateEvent.emit(tipo);
        this.tiposMueblesService.showModalAbm = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  reiniciarForm(): void {
    this.abmForm = {
      placas: 'false',
      descripcion: '',
    }
  }

  submit(): void {
    this.tiposMueblesService.estadoAbm === 'crear' ? this.nuevoTipo() : this.actualizarTipo();
  }

}
