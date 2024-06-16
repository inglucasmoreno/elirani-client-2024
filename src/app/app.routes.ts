import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Default
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  // Login
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./auth/login/login.component'),
  },

  // Inicializacion
  {
    path: 'init',
    title: 'Inicializacion',
    loadComponent: () => import('./inicializacion/inicializacion.component'),
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/pages.component'),
    canActivate: [AuthGuard],
    children: [

      // Home
      {
        path: 'home',
        title: 'Inicio',
        loadComponent: () => import('./pages/home/home.component'),
      },

      // Perfil
      {
        path: 'perfil',
        title: 'Perfil',
        loadComponent: () => import('./pages/perfil/perfil.component'),
      },

      // Usuarios

      {
        path: 'usuarios',
        title: 'Usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios.component'),
      },

      {
        path: 'usuarios/nuevo',
        title: 'Nuevo usuario',
        loadComponent: () => import('./pages/usuarios/nuevo-usuario/nuevo-usuario.component'),
      },

      {
        path: 'usuarios/editar/:id',
        title: 'Editar usuario',
        loadComponent: () => import('./pages/usuarios/editar-usuario/editar-usuario.component'),
      },

      {
        path: 'usuarios/password/:id',
        title: 'Editar password',
        loadComponent: () => import('./pages/usuarios/editar-password/editar-password.component'),
      },

      // Clientes
      {
        path: 'clientes',
        title: 'Clientes',
        loadComponent: () => import('./pages/clientes/clientes.component'),
      },

      // --- OBRAS MADERA ---

      // Obras - Madera
      {
        path: 'obras-madera',
        title: 'Madera - Listado de obras',
        loadComponent: () => import('./pages/obrasMadera/obrasMadera.component'),
      },

      // Tipos muebles
      {
        path: 'tipos-muebles',
        title: 'Madera - Tipos de muebles',
        loadComponent: () => import('./pages/tiposMuebles/tiposMuebles.component'),
      },

      // Tipos placas madera
      {
        path: 'tipos-placas-madera',
        title: 'Madera - Tipos de placa',
        loadComponent: () => import('./pages/tiposPlacasMadera/tiposPlacasMadera.component'),
      },

      // Motivos de pases
      {
        path: 'obras-madera-motivos-pases',
        title: 'Madera - Motivos de pases',
        loadComponent: () => import('./pages/obrasMaderaMotivoPase/obrasMaderaMotivoPase.component'),
      },

    ]
  },

  // Error Page
  {
    path: '**',
    title: 'Error',
    loadComponent: () => import('./error-page/error-page.component'),
  },

];
