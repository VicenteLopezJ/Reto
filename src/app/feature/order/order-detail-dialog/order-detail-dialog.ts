import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../../core/interfaces/order.model';
import { CommonModule, DatePipe, PercentPipe, CurrencyPipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-order-detail-dialog',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,    
    PercentPipe,   
    CurrencyPipe  ],
  templateUrl: './order-detail-dialog.html',
  styleUrl: './order-detail-dialog.scss'
})
export class OrderDetailDialog {
constructor(
    public dialogRef: MatDialogRef<OrderDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
