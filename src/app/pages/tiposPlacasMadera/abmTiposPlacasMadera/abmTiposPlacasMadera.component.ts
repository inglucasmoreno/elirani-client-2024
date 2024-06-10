import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { TiposPlacasMaderaService } from '../../../services/tipos-placas-madera.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { ModalComponent } from '../../../components/modal/modal.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-abmTiposPlacasMadera',
  templateUrl: './abmTiposPlacasMadera.component.html',
  imports: [
    CommonModule,
    FormsModule,
    FechaPipe,
    ModalComponent,
    RouterModule,
  ],
  styleUrls: []
})
export default class AbmTiposPlacasMaderaComponent implements OnInit {

  @Output()
  public insertEvent = new EventEmitter<any>();

  @Output()
  public updateEvent = new EventEmitter<any>();

  public abmForm = {
    codigo: '',
    descripcion: '',
  }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public tiposPlacasMaderaService: TiposPlacasMaderaService,
  ) { }

  ngOnInit() {}

  nuevoTipo(): void {

    // Verificacion
    if (this.tiposPlacasMaderaService.abmForm.codigo.trim() === '') return this.alertService.info('La código es obligatorio');
    if (this.tiposPlacasMaderaService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');

    this.alertService.loading();
    const data = {
      ...this.tiposPlacasMaderaService.abmForm,
      creatorUserId: this.authService.usuario.userId,
    }
    this.tiposPlacasMaderaService.nuevoTipo(data).subscribe({
      next: ({ tipo }) => {
        this.insertEvent.emit(tipo);
        this.tiposPlacasMaderaService.showModalAbm = false;
        this.reiniciarForm();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  actualizarTipo(): void {

    // Verificacion
    if (this.tiposPlacasMaderaService.abmForm.codigo.trim() === '') return this.alertService.info('La código es obligatorio');
    if (this.tiposPlacasMaderaService.abmForm.descripcion.trim() === '')  return this.alertService.info('La descripción es obligatoria');

    this.alertService.loading();
    const data = {
      ...this.tiposPlacasMaderaService.abmForm,
      creatorUserId: this.authService.usuario.userId,
    }

    this.tiposPlacasMaderaService.actualizarTipo(this.tiposPlacasMaderaService.tipoSeleccionado.id, data).subscribe({
      next: ({ tipo }) => {
        this.updateEvent.emit(tipo);
        this.tiposPlacasMaderaService.showModalAbm = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  reiniciarForm(): void {
    this.abmForm = {
      codigo: '',
      descripcion: '',
    }
  }

  submit(): void {
    this.tiposPlacasMaderaService.estadoAbm === 'crear' ? this.nuevoTipo() : this.actualizarTipo();
  }

}
