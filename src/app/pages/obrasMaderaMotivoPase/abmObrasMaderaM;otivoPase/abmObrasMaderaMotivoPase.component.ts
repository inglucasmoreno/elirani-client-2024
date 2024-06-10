import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { ModalComponent } from '../../../components/modal/modal.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { ObrasMaderaMotivoPaseService } from '../../../services/obras-madera-motivo-pase.service';

@Component({
  standalone: true,
  selector: 'app-abmObrasMaderaMotivoPase',
  templateUrl: './abmObrasMaderaMotivoPase.component.html',
  imports: [
    CommonModule,
    FormsModule,
    FechaPipe,
    ModalComponent,
    RouterModule,
  ],
  styleUrls: []
})
export default class AbmObrasMaderaMotivoPaseComponent implements OnInit {

  @Output()
  public insertEvent = new EventEmitter<any>();

  @Output()
  public updateEvent = new EventEmitter<any>();

  public abmForm = {
    descripcion: '',
  }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public motivosService: ObrasMaderaMotivoPaseService,
  ) { }

  ngOnInit() { }

  nuevoMotivo(): void {

    // Verificacion
    if (this.motivosService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');

    this.alertService.loading();
    const data = {
      ...this.motivosService.abmForm,
      creatorUserId: this.authService.usuario.userId,
    }
    this.motivosService.nuevoMotivo(data).subscribe({
      next: ({ motivo }) => {
        this.insertEvent.emit(motivo);
        this.motivosService.showModalAbm = false;
        this.reiniciarForm();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  actualizarMotivo(): void {

    // Verificacion
    if (this.motivosService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');

    this.alertService.loading();
    const data = {
      ...this.motivosService.abmForm,
      creatorUserId: this.authService.usuario.userId,
    }

    this.motivosService.actualizarMotivo(this.motivosService.motivoSeleccionado.id, data).subscribe({
      next: ({ motivo }) => {
        this.updateEvent.emit(motivo);
        this.motivosService.showModalAbm = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  reiniciarForm(): void {
    this.abmForm = {
      descripcion: '',
    }
  }

  submit(): void {
    this.motivosService.estadoAbm === 'crear' ? this.nuevoMotivo() : this.actualizarMotivo();
  }

}
