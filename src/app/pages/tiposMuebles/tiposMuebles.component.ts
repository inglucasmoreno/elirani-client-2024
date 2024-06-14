import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TarjetaListaComponent } from '../../components/tarjeta-lista/tarjeta-lista.component';
import { BotonTablaComponent } from '../../components/boton-tabla/boton-tabla.component';
import { RouterModule } from '@angular/router';
import { PastillaEstadoComponent } from '../../components/pastilla-estado/pastilla-estado.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BotonGenericoComponent } from '../../components/boton-generico/boton-generico.component';
import { FechaPipe } from '../../pipes/fecha.pipe';
import AbmTiposMueblesComponent from './abmTiposMuebles/abmTiposMuebles.component';
import { TiposMueblesService } from '../../services/tipos-muebles.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from '../../services/data.service';
import FiltroTiposMueblesPipe from '../../pipes/filtro-tipos-muebles.pipe';

@Component({
  standalone: true,
  selector: 'app-tiposMuebles',
  templateUrl: './tiposMuebles.component.html',
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
    AbmTiposMueblesComponent,
    FiltroTiposMueblesPipe
  ],
  styleUrls: []
})
export default class TiposMueblesComponent implements OnInit {

  // Permisos
  public permiso_escritura: string[] = ['TIPOS_MUEBLES_ALL'];

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
    public tiposMueblesService: TiposMueblesService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Tipos de muebles';
    this.alertService.loading();
    this.listarTipos();
  }

  abrirAbm(estado: 'crear' | 'editar', tipo: any = null): void {
    this.tiposMueblesService.abrirAbm(estado, tipo);
  }

  // Listar tipos
  listarTipos(): void {
    const parametros: any = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.tiposMueblesService.listarTipos(parametros).subscribe({
      next: ({ tipos }) => {
        this.tiposMueblesService.tipos = tipos;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  }

  nuevoTipo(tipo): void {
    this.tiposMueblesService.tipos = [tipo, ...this.tiposMueblesService.tipos];
    this.alertService.close();
  }

  actualizarTipo(tipo): void {
    const index = this.tiposMueblesService.tipos.findIndex((u: any) => u.id === tipo.id);
    this.tiposMueblesService.tipos[index] = tipo;
    this.tiposMueblesService.tipos = [... this.tiposMueblesService.tipos];
    this.alertService.close();
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(tipo: any): void {

    const { id, activo } = tipo;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.tiposMueblesService.actualizarTipo(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarTipos();
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
    this.listarTipos();
  }

}
