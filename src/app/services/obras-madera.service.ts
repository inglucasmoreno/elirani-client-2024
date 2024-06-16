import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { format } from 'date-fns';

const urlApi = environments.base_url + '/obras-madera';

@Injectable({
  providedIn: 'root'
})
export class ObrasMaderaService {

  public showModalAbm = true;

  public estadoAbm: 'crear' | 'editar' = 'crear';
  public obras: any[] = [];
  public obraSeleccionada: any = null;
  public abmForm = {
    fechaInicio: format(new Date(), 'yyyy-MM-dd'),
    codigo: '',
    clienteId: '',
    descripcion: '',
    domicilio: '',
  };

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) { }

  getObra(id: string): Observable<any> {
    return this.http.get(`${urlApi}/${id}`, {
      headers: this.getToken
    })
  }

  listarObras({ direccion = 'desc', columna = 'id', parametro = '' }): Observable<any> {
    return this.http.get(urlApi, {
      params: {
        direccion: String(direccion),
        columna,
        parametro
      },
      headers: this.getToken
    })
  }

  nuevaObra(data: any): Observable<any> {
    return this.http.post(urlApi, data, {
      headers: this.getToken
    })
  }

  actualizarObra(id: string, data: any): Observable<any> {
    return this.http.patch(`${urlApi}/${id}`, data, {
      headers: this.getToken
    })
  }

  abrirAbm(estado: 'crear' | 'editar', obra: any = null): void {
    this.estadoAbm = estado;
    this.obraSeleccionada = obra;
    this.showModalAbm = true;
    if (estado === 'editar') {
      this.abmForm = {
        fechaInicio: format(obra.fechaInicio, 'yyyy-MM-dd'),
        codigo: obra.codigo,
        clienteId: obra.clienteId,
        descripcion: obra.descripcion,
        domicilio: obra.domicilio,
      }
    } else {
      this.abmForm = {
        fechaInicio: format(new Date(), 'yyyy-MM-dd'),
        codigo: '',
        clienteId: '',
        descripcion: '',
        domicilio: '',
      }
    }
  }

}
