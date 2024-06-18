import { Component, OnInit } from '@angular/core';
import { ObrasMaderaService } from '../../../services/obras-madera.service';
import { DataService } from '../../../services/data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import MonedaPipe from '../../../pipes/moneda.pipe';

@Component({
  standalone: true,
  selector: 'app-obrasMaderaDetalles',
  templateUrl: './obrasMaderaDetalles.component.html',
  styleUrls: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FechaPipe,
    MonedaPipe
  ]
})
export default class ObrasMaderaDetallesComponent implements OnInit {

  public idObra: string = '';
  public obra: any = null;

  public seccion = {
    datosObra: false,
    muebles: true
  }

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private obrasMaderaService: ObrasMaderaService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Obras de Madera - Detalles';
    this.activatedRoute.params.subscribe({
      next: ({ id }) => {
        this.idObra = id;
        this.getObra();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  getObra(): void {
    this.obrasMaderaService.getObra(this.idObra).subscribe({
      next: ({ obra }) => {
        this.obra = obra;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  abrirCerrarSeccion(seccion: string): void {
    this.seccion[seccion] = !this.seccion[seccion];
  }

}
