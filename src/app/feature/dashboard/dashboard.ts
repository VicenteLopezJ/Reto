import { Component, HostListener, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    CommonModule,
    NgChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
gridCols: number = 4;

  cards = [
    { title: 'Productos', value: 6, description: 'Inventario adecuado', colspan: 1 },
    { title: 'Inventario Total', value: 1110, description: 'Unidades en stock', colspan: 1 },
    { title: 'Clientes', value: 1, status: '+1 nuevo', statusClass: 'green', description: 'Clientes registrados', colspan: 1 },
    { title: 'Pedidos', value: 3, status: '2 pedidos pendientes', statusClass: 'yellow', description: '', colspan: 1 }
  ];

  showCharts = false;  

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    
  };

  public barChartType: 'bar' = 'bar';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Productos', 'Clientes', 'Pedidos'],
    datasets: [
      { 
      data: [6, 1, 3], 
      label: 'Totales',
      backgroundColor: ['#1E3A8A', '#374151', '#111827'],  
      borderColor: ['#1E40AF', '#4B5563', '#1F2937'],
      borderWidth: 1,
    }
    ]
  };

  public pieChartType: 'pie' = 'pie';

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [
      {
        data: [45, 25, 30],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
      },
    ],
  };

  ngOnInit() {
    this.updateGridCols();
    if (typeof window !== 'undefined') {
      this.showCharts = true;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.updateGridCols();
  }

  private updateGridCols() {
    if (typeof window !== 'undefined') {
      this.gridCols = window.innerWidth <= 960 ? 2 : 4;
    }
  }

  refreshData() {
    console.log("Datos actualizados.");
  }
}
