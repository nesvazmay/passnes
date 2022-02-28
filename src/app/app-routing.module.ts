import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [

  {
    path: 'inicio',
    loadChildren: () => import('./pass/inicio/inicio.module').then( m => m.InicioPageModule),
    canLoad: [IntroGuard]
  },
  {
    path: 'intro', 
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'acceso',
    loadChildren: () => import('./pass/acceso/acceso.module').then( m => m.AccesoPageModule),
    canLoad: [IntroGuard]
  },
  {
    path: 'modal',
    loadChildren: () => import('./pass/modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'bienvenido',
    loadChildren: () => import('./bienvenido/bienvenido.module').then( m => m.BienvenidoPageModule)
  },
  {
    path: 'prueba',
    loadChildren: () => import('./pass/prueba/prueba.module').then( m => m.PruebaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
