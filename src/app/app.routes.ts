import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { ClienteInterfas } from './layout/cliente-interfas/cliente-interfas';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/login-two/login-two').then(m => m.LoginTwo),
  },
  {
    path: 'login-two',
    loadComponent: () =>
      import('./feature/login-two/login-two').then(m => m.LoginTwo),
  },
  {
    path: '',
    redirectTo: 'login-two',
    pathMatch: 'full',
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'clientes',
        loadComponent: () =>
          import('./feature/clientes/cliente-list/cliente-list').then(m => m.ClienteList),
      },
      {
        path: 'clientes-form',
        loadComponent: () =>
          import('./feature/clientes/cliente-form/cliente-form').then(m => m.ClienteForm),
      },
      {
        path: 'supplier_product',
        loadComponent: () =>
          import( './feature/supplier_product/supplier-product-list/supplier-product-list').then(m => m.SupplierProductList),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./feature/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./feature/inventario/inventory-list/inventory-list').then(m => m.InventoryList),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./feature/order/order-list/order-list').then(m => m.OrderList),
      },

      {
        path: 'pedidos-form',
        loadComponent: () =>
          import('./feature/order/order-form/order-form').then(m => m.OrderForm),
      },


      {
        path: 'pedidos-dialog',
        loadComponent: () =>
          import('./feature/order/order-detail-dialog/order-detail-dialog').then(m => m.OrderDetailDialog),
      },

      {
        path: 'productos',
        loadComponent: () =>
          import('./feature/producto/producto-list/producto-list').then(m => m.ProductoList),
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./feature/proveedores/proveedores').then(m => m.Proveedores),
      },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./feature/usuario/user-list/user-list').then(m => m.UserList),
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'cliente',
    component: ClienteInterfas,
    children: [
      {
        path: 'client-product',
        loadComponent: () =>
          import('./feature/client-product/client-product').then(m => m.ClientProduct),
      },
      {
        path: 'client-profile',
        loadComponent: () =>
          import('./feature/client-profile/client-profile').then(m => m.ClientProfile),
      },
      {
        path: '',
        redirectTo: 'client-product',
        pathMatch: 'full',
      }
    ]
  }
];
