import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number;
  egresos: number;

  totalIngresos: number;
  totalEgresos: number;

  public doughnutChartLabels: string[];
  public doughnutChartData: ChartData<'doughnut'>;
  public doughnutChartType: ChartType;

  constructor(private store: Store<AppState>) {
    this.store.select('ingresoEgreso').subscribe(({items}) => this.generarEstadistica(items));
  
  }

  

  ngOnInit(): void {
  }

  generarEstadistica(items: IngresoEgreso[]) {
    this.totalIngresos = 0, this.totalEgresos = 0, this.ingresos = 0, this.egresos = 0;

    for (const item of items) {
      if(item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos += 1;
      } else {
        this.totalEgresos += item.monto;
        this.egresos += 1;
      }
    }

    this.doughnutChartLabels = ['Ingreso', 'Egreso'];
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data: [ this.totalIngresos, this.totalEgresos ] },
      ]
    }
    this.doughnutChartType = 'doughnut';
  }

}
