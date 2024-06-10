import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const urlApi = environments.base_url + '/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  public showModalAbm = false;

  public estadoAbm: 'crear' | 'editar' = 'crear';
  public clientes: any[] = [];
  public clienteSeleccionado: any = null;
  public abmForm = {
    descripcion: '',
    tipoIdentificacion: 'DNI',
    identificacion: '',
    telefono: '',
    email: '',
    domicilio: '',
  };

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) { }

  getCliente(id: string): Observable<any> {
    return this.http.get(`${urlApi}/${id}`, {
      headers: this.getToken
    })
  }

  getIdentificacion(identificacion: string): Observable<any> {
    return this.http.get(`${urlApi}/identificacion/${identificacion}`, {
      headers: this.getToken
    })
  }

  listarClientes({ direccion = 'desc', columna = 'descripcion', parametro = '' }): Observable<any> {
    return this.http.get(urlApi, {
      params: {
        direccion: String(direccion),
        columna,
        parametro
      },
      headers: this.getToken
    })
  }

  nuevoCliente(data: any): Observable<any> {
    return this.http.post(urlApi, data, {
      headers: this.getToken
    })
  }

  actualizarCliente(id: string, data: any): Observable<any> {
    return this.http.patch(`${urlApi}/${id}`, data, {
      headers: this.getToken
    })
  }

  abrirAbm(estado: 'crear' | 'editar', cliente: any = null): void {
    this.estadoAbm = estado;
    this.clienteSeleccionado = cliente;
    this.showModalAbm = true;
    if (estado === 'editar') {
      this.abmForm = {
        descripcion: cliente.descripcion,
        tipoIdentificacion: cliente.tipoIdentificacion,
        identificacion: cliente.identificacion,
        telefono: cliente.telefono,
        email: '',
        domicilio: cliente.domicilio,
      }
    } else {
      this.abmForm = {
        descripcion: '',
        tipoIdentificacion: 'DNI',
        identificacion: '',
        telefono: '',
        email: '',
        domicilio: '',
      }
    }
  }

}
