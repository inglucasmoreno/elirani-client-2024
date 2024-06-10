import { Component, OnInit } from '@angular/core';
import { ObrasMaderaMotivoPaseService } from '../../services/obras-madera-motivo-pase.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarjetaListaComponent } from '../../components/tarjeta-lista/tarjeta-lista.component';
import { BotonTablaComponent } from '../../components/boton-tabla/boton-tabla.component';
import { RouterModule } from '@angular/router';
import { PastillaEstadoComponent } from '../../components/pastilla-estado/pastilla-estado.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BotonGenericoComponent } from '../../components/boton-generico/boton-generico.component';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { FiltroObrasMaderaMotivoPasePipe } from '../../pipes/filtro-obras-madera-motivo-pase.pipe';
import AbmObrasMaderaMotivoPaseComponent from './abmObrasMaderaM;otivoPase/abmObrasMaderaMotivoPase.component';

@Component({
  standalone: true,
  selector: 'app-obrasMaderaMotivoPase',
  templateUrl: './obrasMaderaMotivoPase.component.html',
  imports: [
    CommonModule,
    FormsModule,
    TarjetaListaComponent,
    BotonTablaComponent,
    RouterModule,
    PastillaEstadoComponent,
    NgxPaginationModule,
    BotonGenericoComponent,
    FechaPipe,
    FiltroObrasMaderaMotivoPasePipe,
    AbmObrasMaderaMotivoPaseComponent
  ],
  styleUrls: []
})
export default class ObrasMaderaMotivoPaseComponent implements OnInit {

  // Permisos
  public permiso_escritura: string[] = ['OBRAS_MADERA_MOTIVO_PASE_ALL'];

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 'desc',  // Asc (1) | Desc (-1)
    columna: 'descripcion'
  }

  constructor(
    public motivosService: ObrasMaderaMotivoPaseService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Motivos de pase';
    this.alertService.loading();
    this.listarMotivos();
  }

  abrirAbm(estado: 'crear' | 'editar', motivo: any = null): void {
    this.motivosService.abrirAbm(estado, motivo);
  }

  // Listar motivos
  listarMotivos(): void {
    const parametros: any = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.motivosService.listarMotivos(parametros).subscribe({
      next: ({ motivos }) => {
        this.motivosService.motivos = motivos;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  }

  nuevoMotivo(motivo): void {
    this.motivosService.motivos = [motivo, ...this.motivosService.motivos];
    this.alertService.close();
  }

  actualizarMotivo(motivo): void {
    const index = this.motivosService.motivos.findIndex((u: any) => u.id === motivo.id);
    this.motivosService.motivos[index] = motivo;
    this.motivosService.motivos = [... this.motivosService.motivos];
    this.alertService.close();
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(motivo: any): void {

    const { id, activo } = motivo;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.motivosService.actualizarMotivo(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarMotivos();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void {
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }

  // Filtrar por Parametro
  filtrarParametro(parametro: string): void {
    this.paginaActual = 1;
    this.filtro.parametro = parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string) {
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 'asc' ? 'desc' : 'asc';
    this.alertService.loading();
    this.listarMotivos();
  }

}
