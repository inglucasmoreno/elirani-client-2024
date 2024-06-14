import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import NavbarSeccionesComponent from './components/navbar-secciones/navbar-secciones.component';
import NavbarItemComponent from './components/navbar-item/navbar-item.component';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    NavbarSeccionesComponent,
    NavbarItemComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {

  public usuarioLogin: any = null;
  public secciones = {
    configuraciones: false,
  };

  constructor(
    public authService: AuthService,
    public dataService: DataService
  ) { }

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
  }

  // Abrir o cerrar seccion
  abrirCerrarSeccion(seccion: string): void {
    this.secciones[seccion] = !this.secciones[seccion];
  }

  // Metodo: Cerrar sesion
  logout(): void { this.authService.logout(); }

}
