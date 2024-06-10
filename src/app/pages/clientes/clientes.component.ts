import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { TarjetaListaComponent } from '../../components/tarjeta-lista/tarjeta-lista.component';
import { BotonTablaComponent } from '../../components/boton-tabla/boton-tabla.component';
import { RouterModule } from '@angular/router';
import { PastillaEstadoComponent } from '../../components/pastilla-estado/pastilla-estado.component';
import { FiltroUsuariosPipe } from '../../pipes/filtro-usuarios.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BotonGenericoComponent } from '../../components/boton-generico/boton-generico.component';
import { FormsModule } from '@angular/forms';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { FiltroClientesPipe } from '../../pipes/filtro-clientes.pipe';
import AbmClientesComponent from './abmClientes/abmClientes.component';

@Component({
  standalone: true,
  selector: 'app-clientes',
  imports: [
    CommonModule,
    FormsModule,
    TarjetaListaComponent,
    BotonTablaComponent,
    RouterModule,
    PastillaEstadoComponent,
    FiltroUsuariosPipe,
    NgxPaginationModule,
    BotonGenericoComponent,
    FechaPipe,
    FiltroClientesPipe,
    AbmClientesComponent
  ],
  templateUrl: './clientes.component.html',
  styleUrls: []
})
export default class ClientesComponent implements OnInit {

  // Permisos
  public permiso_escritura: string[] = ['CLIENTES_ALL'];

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
    public clientesService: ClientesService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Clientes';
    this.alertService.loading();
    this.listarClientes();
  }

  abrirAbm(estado: 'crear' | 'editar', cliente: any = null): void {
    this.clientesService.abrirAbm(estado, cliente);
  }

  // Listar clientes
  listarClientes(): void {
    const parametros: any = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.clientesService.listarClientes(parametros).subscribe({
      next: ({ clientes }) => {
        this.clientesService.clientes = clientes;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  }

  nuevoCliente(cliente): void {
    this.clientesService.clientes = [cliente, ...this.clientesService.clientes];
    this.alertService.close();
  }

  actualizarCliente(cliente): void {
    const index = this.clientesService.clientes.findIndex((u: any) => u.id === cliente.id);
    this.clientesService.clientes[index] = cliente;
    this.clientesService.clientes = [... this.clientesService.clientes];
    this.alertService.close();
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(cliente: any): void {

    const { id, activo } = cliente;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.clientesService.actualizarCliente(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarClientes();
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
    this.listarClientes();
  }

}
