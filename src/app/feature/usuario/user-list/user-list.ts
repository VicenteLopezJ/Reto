import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { parseISO, isValid } from 'date-fns';

import Swal from 'sweetalert2'; 

import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/interfaces/usuario'; 
import { UserForm } from '../user-form/user-form';
import { UserSaleRegister } from '../user-sale-register/user-sale-register';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatCardModule,
    MatChipsModule,
    DatePipe,],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit, AfterViewInit {
 displayedColumns: string[] = [
    'id',
    'vendedor',
    'contacto',
    'genero',
    'ventas',
    'cantidad', 
    'registrationDate',
    'acciones',
  ];
  dataSource = new MatTableDataSource<Usuario>();
  isLoading = true;
  currentFilterStatus: 'all' | 'active' | 'inactive' = 'active'; 
  allUsers: Usuario[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      const searchTerm = filter.trim().toLowerCase();
      const fullName = (data.firstName + ' ' + data.lastName).toLowerCase();
      const document = (
        data.documentType +
        ' ' +
        data.numberDocument
      ).toLowerCase();
      const email = (data.email || '').toLowerCase();
      const address = (data.address || '').toLowerCase();

      const matchesSearch =
        fullName.includes(searchTerm) ||
        document.includes(searchTerm) ||
        email.includes(searchTerm) ||
        address.includes(searchTerm);

      if (this.currentFilterStatus === 'active') {
        return matchesSearch && data.estado === 'A';
      } else if (this.currentFilterStatus === 'inactive') {
        return matchesSearch && data.estado === 'I';
      }
      return matchesSearch; 
    };
  }

  ngAfterViewInit() {
  
  }

  private connectPaginatorAndSort(): void {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.dataSource.data.length > 0) {
        this.paginator.firstPage();
      }
    } else {
      console.warn('Paginador o Sort aún no disponibles.');
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usuarioService.findAll().subscribe({
      next: (data) => {
        this.allUsers = data.map((user) => {
          return {
            ...user,
            totalSales: user.totalSales ?? 0, 
            totalSaleAmount: user.totalSaleAmount ?? 0,
            registrationDate: user.registrationDate
              ? typeof user.registrationDate === 'string' &&
                isValid(parseISO(user.registrationDate))
                ? parseISO(user.registrationDate)
                : user.registrationDate instanceof Date
                ? user.registrationDate
                : null
              : null,
            lastSaleDate: user.lastSaleDate
              ? typeof user.lastSaleDate === 'string' &&
                isValid(parseISO(user.lastSaleDate))
                ? parseISO(user.lastSaleDate)
                : user.lastSaleDate instanceof Date
                ? user.lastSaleDate
                : null
              : null,
          };
        });
        this.applyStatusFilter(this.currentFilterStatus); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:
            'Error al cargar la lista de vendedores. Por favor, inténtelo de nuevo más tarde.',
          confirmButtonText: 'Entendido',
        });
      },
    });
  }

  applyStatusFilter(status: 'all' | 'active' | 'inactive'): void {
    this.currentFilterStatus = status;
    let filteredUsers: Usuario[] = [];

    if (status === 'active') {
      filteredUsers = this.allUsers.filter(user => user.estado === 'A');
    } else if (status === 'inactive') {
      filteredUsers = this.allUsers.filter(user => user.estado === 'I');
    } else {
      filteredUsers = [...this.allUsers];
    }
    this.dataSource.data = filteredUsers;
    this.dataSource.filter = this.dataSource.filter; 
    setTimeout(() => {
      this.connectPaginatorAndSort();
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      setTimeout(() => {
        this.connectPaginatorAndSort();
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserForm, {
      width: '600px',
      data: { isEdit: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openEditUserDialog(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UserForm, {
      width: '600px',
      data: { isEdit: true, usuario: { ...usuario } }, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(id: number | undefined): void {
    if (id === undefined) {
      console.error('No se puede eliminar usuario: el ID es indefinido.');
      Swal.fire({
        icon: 'error',
        title: 'Error de Eliminación',
        text: 'Error: ID de usuario no disponible para eliminar.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto! El usuario será marcado como inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', 
      cancelButtonColor: '#d33', 
      confirmButtonText: 'Sí, eliminarlo lógicamente',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(id).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire(
              '¡Eliminado!',
              'El usuario ha sido eliminado lógicamente (marcado como inactivo).',
              'success'
            );
          },
          error: (err) => {
            console.error('Error al eliminar usuario:', err);
            Swal.fire(
              'Error',
              'Hubo un error al eliminar el usuario. Por favor, inténtelo de nuevo.',
              'error'
            );
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'La eliminación del usuario ha sido cancelada.',
          'info'
        );
      }
    });
  }

  openUserSaleRegisterDialog(usuario: Usuario): void {
    if (usuario.id === undefined) {
      console.error(
        'No se puede registrar la venta: el ID de usuario es indefinido.'
      );
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: 'Error: ID de usuario no disponible para registrar venta.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    const dialogRef = this.dialog.open(UserSaleRegister, {
      width: '400px',
      data: {
        userId: usuario.id,
        userName: `${usuario.firstName} ${usuario.lastName}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.saleAmount !== undefined && result.quantity !== undefined) {
        const saleAmount = parseFloat(result.saleAmount);
        const quantity = parseInt(result.quantity, 10); 

        if (!isNaN(saleAmount) && saleAmount > 0 && !isNaN(quantity) && quantity > 0) {
          console.log(
            `Intentando registrar venta de S/ ${saleAmount} (Cantidad: ${quantity}) para el usuario ID: ${usuario.id}`
          );

          this.usuarioService.registerSale(usuario.id, saleAmount, quantity).subscribe({
            next: (updatedUsuario) => {
              Swal.fire('¡Éxito!', 'Venta registrada exitosamente!', 'success');
              this.loadUsers(); 
            },
            error: (err) => {
              console.error('Error al registrar venta:', err);
              let errorMessage =
                'Error al registrar venta. Verifique la consola para más detalles.';
              if (err.status === 500) {
                errorMessage =
                  'Error al registrar venta: Error interno del servidor. Verifique logs del backend.';
              } else if (err.status === 0) {
                errorMessage =
                  'Error de conexión o CORS. Asegúrese que el backend esté funcionando y la configuración CORS sea correcta.';
              }
              Swal.fire('Error', errorMessage, 'error');
            },
          });
        } else {
          Swal.fire(
            'Atención',
            'Monto de venta y/o cantidad inválidos o no positivos. Intente nuevamente.',
            'warning'
          );
        }
      } else {
        console.log('Registro de venta cancelado o diálogo cerrado sin valores válidos.');
      }
    });
  }
}
