import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const urlApi = environments.base_url + '/obras-madera-motivo-pase';

@Injectable({
  providedIn: 'root'
})
export class ObrasMaderaMotivoPaseService {

  public showModalAbm = false;

  public estadoAbm: 'crear' | 'editar' = 'crear';
  public motivo: any[] = [];
  public motivoSeleccionado: any = null;
  public abmForm = {
    descripcion: '',
    activo: true
  };

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) { }

  getMotivo(id: string): Observable<any> {
    return this.http.get(`${urlApi}/${id}`, {
      headers: this.getToken
    })
  }

  listarMotivos({ direccion = 'desc', columna = 'descripcion', parametro = '' }): Observable<any> {
    return this.http.get(urlApi, {
      params: {
        direccion: String(direccion),
        columna,
        parametro
      },
      headers: this.getToken
    })
  }

  nuevoMotivo(data: any): Observable<any> {
    return this.http.post(urlApi, data, {
      headers: this.getToken
    })
  }

  actualizarMotivo(id: string, data: any): Observable<any> {
    return this.http.patch(`${urlApi}/${id}`, data, {
      headers: this.getToken
    })
  }

  abrirAbm(estado: 'crear' | 'editar', motivo: any = null): void {
    this.estadoAbm = estado;
    this.motivoSeleccionado = motivo;
    this.showModalAbm = true;
    if (estado === 'editar') {
      this.abmForm = {
        descripcion: motivo.descripcion,
        activo: true,
      }
    } else {
      this.abmForm = {
        descripcion: '',
        activo: true
      }
    }
  }

}
