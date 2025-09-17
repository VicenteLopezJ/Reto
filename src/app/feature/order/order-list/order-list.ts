import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';

import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/interfaces/order.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';

import { OrderForm } from '../order-form/order-form';
import { OrderDetailDialog } from '../order-detail-dialog/order-detail-dialog';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-order-list',
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatSortModule,
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList implements OnInit, AfterViewInit {
private orderService = inject(OrderService);
  private dialog = inject(MatDialog);

  dataSourceCompleted = new MatTableDataSource<Order>([]);
  dataSourcePending = new MatTableDataSource<Order>([]);
  dataSourceCancelled = new MatTableDataSource<Order>([]);

  @ViewChild('paginatorCompleted') paginatorCompleted!: MatPaginator;
  @ViewChild('paginatorPending') paginatorPending!: MatPaginator;
  @ViewChild('paginatorCancelled') paginatorCancelled!: MatPaginator;

  @ViewChild('sortCompleted') sortCompleted!: MatSort;
  @ViewChild('sortPending') sortPending!: MatSort;
  @ViewChild('sortCancelled') sortCancelled!: MatSort;

  displayedColumns: string[] = [
    'id',
    'orderDate',
    'deliveryDate',
    'deliveryAddress',
    'paymentMethod',
    'notes',
    'totalAmount',
    'status',
    'actions',
    'details',
    'report',
  ];

  private allOrders: Order[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSourceCompleted.paginator = this.paginatorCompleted;
      this.dataSourceCompleted.sort = this.sortCompleted;

      this.dataSourcePending.paginator = this.paginatorPending;
      this.dataSourcePending.sort = this.sortPending;

      this.dataSourceCancelled.paginator = this.paginatorCancelled;
      this.dataSourceCancelled.sort = this.sortCancelled;
    });
  }

  generateReport(orderId: number): void {
    this.orderService.generateOrderReport(orderId).subscribe({
      next: (data: Blob) => {
        const fileURL = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `reporte_orden_${orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
      },
      error: (err) => {
        console.error('Error al generar el reporte:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el reporte de la orden.',
        });
      },
    });
  }

  loadOrders(): void {
    this.orderService.findAll().subscribe({
      next: (data: Order[]) => {
        this.allOrders = data;
        this.filterOrdersByStatus();
        if (this.paginatorCompleted) {
            this.dataSourceCompleted.paginator = this.paginatorCompleted;
            this.dataSourceCompleted.sort = this.sortCompleted;
            this.paginatorCompleted.firstPage();
        }
        if (this.paginatorPending) {
            this.dataSourcePending.paginator = this.paginatorPending;
            this.dataSourcePending.sort = this.sortPending;
            this.paginatorPending.firstPage();
        }
        if (this.paginatorCancelled) {
            this.dataSourceCancelled.paginator = this.paginatorCancelled;
            this.dataSourceCancelled.sort = this.sortCancelled;
            this.paginatorCancelled.firstPage();
        }
      },
      error: (err) => {
        console.error('Error al cargar las órdenes:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar las órdenes.',
        });
      },
    });
  }

  private filterOrdersByStatus(): void {
    this.dataSourceCompleted.data = this.allOrders.filter(
      (order) => order.status === 'E'
    );
    this.dataSourcePending.data = this.allOrders.filter(
      (order) => order.status === 'P'
    );
    this.dataSourceCancelled.data = this.allOrders.filter(
      (order) => order.status === 'C'
    );
  }

  onTabChange(event: MatTabChangeEvent): void {
    setTimeout(() => {
      if (event.index === 0) {
        this.dataSourceCompleted.paginator = this.paginatorCompleted;
        this.dataSourceCompleted.sort = this.sortCompleted;
      } else if (event.index === 1) {
        this.dataSourcePending.paginator = this.paginatorPending;
        this.dataSourcePending.sort = this.sortPending;
      } else if (event.index === 2) {
        this.dataSourceCancelled.paginator = this.paginatorCancelled;
        this.dataSourceCancelled.sort = this.sortCancelled;
      }
    });
  }

  editOrder(order: Order): void {
    Swal.fire({
      title: '¿Editar esta orden?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(OrderForm, {
          width: '700px',
          data: { order: { ...order } },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.loadOrders();
          }
        });
      }
    });
  }

  createNewOrder(): void {
    const newOrder: Partial<Order> = {
      orderDate: new Date(),
      status: 'P',
    };

    const dialogRef = this.dialog.open(OrderForm, {
      width: '700px',
      data: { order: newOrder },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadOrders();
      }
    });
  }

  deleteOrder(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta orden?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteLogico(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'La orden ha sido eliminada.',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
            this.loadOrders();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la orden.',
            });
          },
        });
      }
    });
  }

  viewDetails(order: Order): void {
    this.dialog.open(OrderDetailDialog, {
      width: '600px',
      data: { order },
    });
  }
}
