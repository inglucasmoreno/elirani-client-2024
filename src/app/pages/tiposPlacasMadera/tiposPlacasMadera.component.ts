import { Component, OnInit } from '@angular/core';
import { TiposPlacasMaderaService } from '../../services/tipos-placas-madera.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarjetaListaComponent } from '../../components/tarjeta-lista/tarjeta-lista.component';
import { BotonTablaComponent } from '../../components/boton-tabla/boton-tabla.component';
import { RouterModule } from '@angular/router';
import { PastillaEstadoComponent } from '../../components/pastilla-estado/pastilla-estado.component';
import { FiltroTiposPlacasMaderaPipe } from '../../pipes/filtro-tipos-placas-madera.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BotonGenericoComponent } from '../../components/boton-generico/boton-generico.component';
import { FechaPipe } from '../../pipes/fecha.pipe';
import AbmTiposPlacasMaderaComponent from './abmTiposPlacasMadera/abmTiposPlacasMadera.component';

@Component({
  standalone: true,
  selector: 'app-tiposPlacasMadera',
  templateUrl: './tiposPlacasMadera.component.html',
  imports: [
    CommonModule,
    FormsModule,
    TarjetaListaComponent,
    BotonTablaComponent,
    RouterModule,
    PastillaEstadoComponent,
    FiltroTiposPlacasMaderaPipe,
    NgxPaginationModule,
    BotonGenericoComponent,
    FechaPipe,
    AbmTiposPlacasMaderaComponent
  ],
  styleUrls: []
})
export default class TiposPlacasMaderaComponent implements OnInit {

  // Permisos
  public permiso_escritura: string[] = ['TIPOS_PLACAS_MADERA_ALL'];

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
    public tiposPlacasMaderaService: TiposPlacasMaderaService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Tipos placas madera';
    this.alertService.loading();
    this.listarTipos();
  }

  abrirAbm(estado: 'crear' | 'editar', tipo: any = null): void {
    this.tiposPlacasMaderaService.abrirAbm(estado, tipo);
  }

  // Listar tipos
  listarTipos(): void {
    const parametros: any = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.tiposPlacasMaderaService.listarTipos(parametros).subscribe({
      next: ({ tipos }) => {
        this.tiposPlacasMaderaService.tipos = tipos;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  }

  nuevoTipo(tipo): void {
    this.tiposPlacasMaderaService.tipos = [tipo, ...this.tiposPlacasMaderaService.tipos];
    this.alertService.close();
  }

  actualizarTipo(tipo): void {
    const index = this.tiposPlacasMaderaService.tipos.findIndex((u: any) => u.id === tipo.id);
    this.tiposPlacasMaderaService.tipos[index] = tipo;
    this.tiposPlacasMaderaService.tipos = [... this.tiposPlacasMaderaService.tipos];
    this.alertService.close();
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(tipo: any): void {

    const { id, activo } = tipo;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.tiposPlacasMaderaService.actualizarTipo(id, { activo: !activo }).subscribe({
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
