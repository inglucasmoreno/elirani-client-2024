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
import AbmObrasMaderaComponent from './abmObrasMadera/abmObrasMadera.component';
import { ObrasMaderaService } from '../../services/obras-madera.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from '../../services/data.service';

@Component({
  standalone: true,
  selector: 'app-obrasMadera',
  templateUrl: './obrasMadera.component.html',
  styleUrls: [],
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
    AbmObrasMaderaComponent,
  ]

})
export default class ObrasMaderaComponent implements OnInit {

  // Permisos
  public permiso_escritura: string[] = ['OBRAS_MADERA_ALL'];

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
    columna: 'id'
  }

  constructor(
    public obrasMaderaService: ObrasMaderaService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Obras madera';
    this.alertService.loading();
    this.listarObras();
  }

  abrirAbm(estado: 'crear' | 'editar', obra: any = null): void {
    this.obrasMaderaService.abrirAbm(estado, obra);
  }

  // Listar obras
  listarObras(): void {
    const parametros: any = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.obrasMaderaService.listarObras(parametros).subscribe({
      next: ({ obras }) => {
        this.obrasMaderaService.obras = obras;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  }

  nuevaObra(obra): void {
    this.obrasMaderaService.obras = [obra, ...this.obrasMaderaService.obras];
    this.alertService.close();
  }

  actualizarObra(obra): void {
    const index = this.obrasMaderaService.obras.findIndex((item: any) => item.id === obra.id);
    this.obrasMaderaService.obras[index] = obra;
    this.obrasMaderaService.obras = [... this.obrasMaderaService.obras];
    this.alertService.close();
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(obra: any): void {

    const { id, activo } = obra;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.obrasMaderaService.actualizarObra(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarObras();
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
    this.listarObras();
  }

}
